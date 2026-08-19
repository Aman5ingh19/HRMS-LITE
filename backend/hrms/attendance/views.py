"""
Attendance views — production-grade with:
- Pydantic validation
- Redis caching
- Pagination
- Rate limiting
- Structured logging
"""

import logging
from datetime import datetime
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.core.cache import cache

from hrms.mongo import employees_collection, attendance_collection
from employees.validators import AttendanceCheckInSchema, AttendanceCheckOutSchema, format_pydantic_errors
from pydantic import ValidationError

logger = logging.getLogger('hrms')

ATTENDANCE_CACHE_TTL = 30  # seconds


def _invalidate_attendance_cache():
    """Invalidate attendance cache entries."""
    cache.delete('attendance:all')
    cache.delete_pattern('attendance:*') if hasattr(cache, 'delete_pattern') else None


@api_view(['GET'])
@throttle_classes([AnonRateThrottle])
def get_all_attendance(request):
    """
    Get paginated list of all attendance records.
    Query params: ?page=1&limit=10&date=2026-08-19&employee_id=EMP001
    """
    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 10))
    filter_date = request.query_params.get('date', '').strip()
    filter_emp = request.query_params.get('employee_id', '').strip().upper()

    page = max(1, page)
    limit = min(max(1, limit), 100)

    cache_key = f'attendance:page:{page}:limit:{limit}:date:{filter_date}:emp:{filter_emp}'
    cached = cache.get(cache_key)
    if cached is not None:
        logger.info(f'Cache HIT for {cache_key}')
        return Response(cached, status=200)

    query = {}
    if filter_date:
        query['date'] = filter_date
    if filter_emp:
        query['employee_id'] = filter_emp

    total = attendance_collection.count_documents(query)
    skip = (page - 1) * limit
    records = list(
        attendance_collection.find(query, {'_id': 0})
        .sort('date', -1)
        .skip(skip)
        .limit(limit)
    )

    response_data = {
        'data': records,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'total_pages': (total + limit - 1) // limit,
            'has_next': (skip + limit) < total,
            'has_prev': page > 1,
        }
    }

    cache.set(cache_key, response_data, ATTENDANCE_CACHE_TTL)
    return Response(response_data, status=200)


@api_view(['GET'])
@throttle_classes([AnonRateThrottle])
def get_employee_attendance(request, employee_id):
    """Get attendance records for a specific employee with pagination."""
    employee_id = employee_id.upper()
    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 10))
    page = max(1, page)
    limit = min(max(1, limit), 100)

    cache_key = f'attendance:emp:{employee_id}:page:{page}:limit:{limit}'
    cached = cache.get(cache_key)
    if cached is not None:
        return Response(cached, status=200)

    query = {'employee_id': employee_id}
    total = attendance_collection.count_documents(query)
    skip = (page - 1) * limit
    records = list(
        attendance_collection.find(query, {'_id': 0})
        .sort('date', -1)
        .skip(skip)
        .limit(limit)
    )

    response_data = {
        'data': records,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'total_pages': max(1, (total + limit - 1) // limit),
            'has_next': (skip + limit) < total,
            'has_prev': page > 1,
        }
    }
    cache.set(cache_key, response_data, ATTENDANCE_CACHE_TTL)
    return Response(response_data, status=200)


@api_view(['POST'])
@throttle_classes([AnonRateThrottle])
def check_in(request):
    """Record employee check-in with Pydantic validation."""
    try:
        validated = AttendanceCheckInSchema(**request.data)
    except ValidationError as exc:
        return Response(
            {'error': 'Validation failed', 'details': format_pydantic_errors(exc)},
            status=400
        )

    employee_id = validated.employee_id

    # Verify employee exists
    employee = employees_collection.find_one({'employee_id': employee_id})
    if not employee:
        return Response({'error': f'Employee {employee_id} not found'}, status=404)

    today = datetime.now().strftime('%Y-%m-%d')
    current_time = datetime.now().strftime('%H:%M:%S')

    # Idempotent: already checked in today
    existing = attendance_collection.find_one({'employee_id': employee_id, 'date': today})
    if existing:
        return Response({'message': 'Already checked in for today', 'check_in_time': existing.get('check_in_time')}, status=200)

    record = {
        'employee_id': employee_id,
        'employee_name': employee.get('full_name', ''),
        'date': today,
        'check_in_time': current_time,
        'check_out_time': '',
        'status': 'Present',
    }
    attendance_collection.insert_one(record)
    _invalidate_attendance_cache()

    logger.info(f'Check-in: {employee_id} at {current_time}')
    return Response({'message': 'Check-in successful', 'check_in_time': current_time}, status=200)


@api_view(['POST'])
@throttle_classes([AnonRateThrottle])
def check_out(request):
    """Record employee check-out with Pydantic validation."""
    try:
        validated = AttendanceCheckOutSchema(**request.data)
    except ValidationError as exc:
        return Response(
            {'error': 'Validation failed', 'details': format_pydantic_errors(exc)},
            status=400
        )

    employee_id = validated.employee_id
    today = datetime.now().strftime('%Y-%m-%d')
    current_time = datetime.now().strftime('%H:%M:%S')

    existing = attendance_collection.find_one({'employee_id': employee_id, 'date': today})
    if not existing:
        return Response({'error': 'Check-in required before check-out'}, status=400)

    if existing.get('check_out_time') and existing.get('check_out_time') != '':
        return Response({'message': 'Already checked out today', 'check_out_time': existing.get('check_out_time')}, status=200)

    # Calculate duration
    try:
        from datetime import time as dt_time
        checkin_dt = datetime.strptime(f"{today} {existing['check_in_time']}", '%Y-%m-%d %H:%M:%S')
        checkout_dt = datetime.strptime(f"{today} {current_time}", '%Y-%m-%d %H:%M:%S')
        duration_minutes = int((checkout_dt - checkin_dt).total_seconds() / 60)
        duration_str = f"{duration_minutes // 60}h {duration_minutes % 60}m"
    except Exception:
        duration_str = ''

    attendance_collection.update_one(
        {'employee_id': employee_id, 'date': today},
        {'$set': {'check_out_time': current_time, 'duration': duration_str}}
    )
    _invalidate_attendance_cache()

    logger.info(f'Check-out: {employee_id} at {current_time}, duration: {duration_str}')
    return Response({'message': 'Check-out successful', 'check_out_time': current_time, 'duration': duration_str}, status=200)
