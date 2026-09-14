"""
Employee views — production-grade with:
- Pydantic validation (Zod-equivalent)
- Redis caching
- Pagination
- Rate limiting
- Cloudinary photo upload (Multer-equivalent)
- Structured logging (Winston-equivalent)
"""

import logging
import cloudinary
import cloudinary.uploader
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django.core.cache import cache
from django.conf import settings
from pydantic import ValidationError

from hrms.mongo import employees_collection
from .validators import EmployeeCreateSchema, format_pydantic_errors
from hrms.messaging import publish_task, publish_event, trigger_n8n_webhook

logger = logging.getLogger('hrms')

# Cache key constants
EMPLOYEES_CACHE_KEY = 'employees:all'
EMPLOYEES_CACHE_TTL = 60  # seconds

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'),
    api_key=settings.CLOUDINARY_STORAGE.get('API_KEY'),
    api_secret=settings.CLOUDINARY_STORAGE.get('API_SECRET'),
    secure=True,
)


def _invalidate_employee_cache():
    """Invalidate all employee-related cache entries."""
    cache.delete(EMPLOYEES_CACHE_KEY)
    cache.delete_pattern('employees:page:*') if hasattr(cache, 'delete_pattern') else None


@api_view(['GET'])
@throttle_classes([AnonRateThrottle])
def get_employees(request):
    """
    Get paginated list of employees.
    Query params: ?page=1&limit=10&search=name
    Caches results in Redis for 60 seconds.
    """
    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 10))
    search = request.query_params.get('search', '').strip()

    # Clamp values
    page = max(1, page)
    limit = min(max(1, limit), 100)

    cache_key = f'employees:page:{page}:limit:{limit}:search:{search}'

    # Try to serve from cache
    cached = cache.get(cache_key)
    if cached is not None:
        logger.info(f'Cache HIT for {cache_key}')
        return Response(cached, status=status.HTTP_200_OK)

    # Build search query
    query = {}
    if search:
        query = {
            '$or': [
                {'full_name': {'$regex': search, '$options': 'i'}},
                {'employee_id': {'$regex': search, '$options': 'i'}},
                {'department': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}},
            ]
        }

    total = employees_collection.count_documents(query)
    skip = (page - 1) * limit
    employees = list(
        employees_collection.find(query, {'_id': 0})
        .sort('created_at', -1)
        .skip(skip)
        .limit(limit)
    )

    response_data = {
        'data': employees,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'total_pages': (total + limit - 1) // limit,
            'has_next': (skip + limit) < total,
            'has_prev': page > 1,
        }
    }

    # Store in cache
    cache.set(cache_key, response_data, EMPLOYEES_CACHE_TTL)
    logger.info(f'Cache MISS for {cache_key} — fetched from DB')
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@throttle_classes([AnonRateThrottle])
def get_employee_by_id(request, emp_id):
    """Get a single employee by employee_id."""
    emp_id = emp_id.upper()
    cache_key = f'employee:{emp_id}'
    cached = cache.get(cache_key)
    if cached is not None:
        return Response(cached, status=status.HTTP_200_OK)

    employee = employees_collection.find_one({'employee_id': emp_id}, {'_id': 0})
    if not employee:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

    cache.set(cache_key, employee, EMPLOYEES_CACHE_TTL)
    return Response(employee, status=status.HTTP_200_OK)


@api_view(['POST'])
@throttle_classes([AnonRateThrottle])
def create_employee(request):
    """
    Add a new employee with Pydantic (Zod) validation.
    Invalidates employee cache on success, emits Kafka telemetry, RabbitMQ tasks & n8n webhook.
    """
    # Validate with Pydantic
    try:
        validated = EmployeeCreateSchema(**request.data)
    except ValidationError as exc:
        errors = format_pydantic_errors(exc)
        logger.warning(f'Employee validation failed: {errors}')
        return Response({'error': 'Validation failed', 'details': errors}, status=status.HTTP_400_BAD_REQUEST)

    employee_data = validated.model_dump(exclude_none=True)

    # Check for duplicate employee_id
    existing = employees_collection.find_one({'employee_id': employee_data['employee_id']})
    if existing:
        return Response({'error': 'Employee with this ID already exists'}, status=status.HTTP_409_CONFLICT)

    # Check for duplicate email
    existing_email = employees_collection.find_one({'email': employee_data['email']})
    if existing_email:
        return Response({'error': 'An employee with this email already exists'}, status=status.HTTP_409_CONFLICT)

    employees_collection.insert_one(employee_data)
    _invalidate_employee_cache()

    logger.info(f'Employee created: {employee_data["employee_id"]}')

    # Event-Driven Architecture Dispatches
    # 1. RabbitMQ Async Task: Send Welcome Email
    publish_task('send_welcome_email', {
        'employee_id': employee_data['employee_id'],
        'full_name': employee_data['full_name'],
        'email': employee_data['email'],
        'department': employee_data.get('department', 'Engineering'),
    })

    # 2. Apache Kafka Real-Time Stream: EMPLOYEE_CREATED
    publish_event(
        topic='hrms.employee.events',
        event_type='EMPLOYEE_CREATED',
        data=employee_data,
        key=employee_data['employee_id']
    )

    # 3. n8n Workflow Automation Webhook Trigger
    trigger_n8n_webhook(
        endpoint_path='employee-onboarding',
        event_name='EMPLOYEE_CREATED',
        payload=employee_data
    )

    return Response({'message': 'Employee added successfully', 'employee_id': employee_data['employee_id']}, status=status.HTTP_201_CREATED)


# Alias for backwards compatibility
add_employee = create_employee


@api_view(['DELETE'])
@throttle_classes([AnonRateThrottle])
def delete_employee(request, emp_id):
    """
    Delete an employee. Invalidates cache, removes Cloudinary photo and emits Kafka stream event.
    """
    emp_id = emp_id.upper()

    # Get employee to check for photo before deletion
    employee = employees_collection.find_one({'employee_id': emp_id}, {'_id': 0})
    if not employee:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

    # Delete Cloudinary photo if exists
    photo_public_id = employee.get('cloudinary_public_id')
    if photo_public_id:
        try:
            cloudinary.uploader.destroy(photo_public_id)
            logger.info(f'Cloudinary photo deleted for employee {emp_id}')
        except Exception as e:
            logger.warning(f'Failed to delete Cloudinary photo for {emp_id}: {e}')

    employees_collection.delete_one({'employee_id': emp_id})
    _invalidate_employee_cache()

    logger.info(f'Employee deleted: {emp_id}')

    # Kafka stream event: EMPLOYEE_DELETED
    publish_event(
        topic='hrms.employee.events',
        event_type='EMPLOYEE_DELETED',
        data={'employee_id': emp_id},
        key=emp_id
    )

    return Response({'message': 'Employee deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@throttle_classes([AnonRateThrottle])
def upload_employee_photo(request):
    """
    Multer-equivalent: Upload an employee profile photo to Cloudinary.
    Expects multipart/form-data with 'employee_id' and 'photo' fields.
    Max file size: 5MB. Allowed types: image/jpeg, image/png, image/webp.
    """
    employee_id = request.data.get('employee_id', '').strip().upper()
    photo_file = request.FILES.get('photo')

    if not employee_id:
        return Response({'error': 'employee_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not photo_file:
        return Response({'error': 'photo file is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if photo_file.content_type not in allowed_types:
        return Response(
            {'error': f'Invalid file type. Allowed: {", ".join(allowed_types)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate file size (5MB)
    if photo_file.size > 5 * 1024 * 1024:
        return Response({'error': 'File size must be less than 5MB'}, status=status.HTTP_400_BAD_REQUEST)

    # Check employee exists
    employee = employees_collection.find_one({'employee_id': employee_id})
    if not employee:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

    if not settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'):
        return Response({'error': 'Cloudinary is not configured on the server'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    try:
        # Delete old photo if exists
        old_public_id = employee.get('cloudinary_public_id')
        if old_public_id:
            cloudinary.uploader.destroy(old_public_id)

        # Upload to Cloudinary
        folder_prefix = getattr(settings, 'CLOUDINARY_FOLDER', 'hrms/employees')
        upload_result = cloudinary.uploader.upload(
            photo_file,
            folder=folder_prefix,
            public_id=f'employee_{employee_id}',
            overwrite=True,
            transformation=[
                {'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'},
                {'quality': 'auto', 'fetch_format': 'auto'},  # CDN optimization
            ]
        )

        # Update employee record
        employees_collection.update_one(
            {'employee_id': employee_id},
            {'$set': {
                'profile_photo_url': upload_result['secure_url'],
                'cloudinary_public_id': upload_result['public_id'],
            }}
        )
        _invalidate_employee_cache()

        logger.info(f'Photo uploaded for employee {employee_id}: {upload_result["secure_url"]}')
        return Response({
            'message': 'Photo uploaded successfully',
            'photo_url': upload_result['secure_url'],
            'cdn_url': upload_result['secure_url'],  # Cloudinary serves via CDN automatically
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Cloudinary upload failed for {employee_id}: {e}')
        return Response({'error': 'Photo upload failed. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@throttle_classes([AnonRateThrottle])
def upload_admin_avatar(request):
    """
    Upload an administrator / user profile avatar directly to Cloudinary.
    Expects multipart/form-data with 'photo' file.
    """
    photo_file = request.FILES.get('photo')
    email = request.data.get('email', 'admin').strip()

    if not photo_file:
        return Response({'error': 'photo file is required'}, status=status.HTTP_400_BAD_REQUEST)

    allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if photo_file.content_type not in allowed_types:
        return Response(
            {'error': f'Invalid file type. Allowed: {", ".join(allowed_types)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if photo_file.size > 5 * 1024 * 1024:
        return Response({'error': 'File size must be less than 5MB'}, status=status.HTTP_400_BAD_REQUEST)

    if not settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'):
        return Response({'error': 'Cloudinary is not configured on the server'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    try:
        folder_prefix = getattr(settings, 'CLOUDINARY_FOLDER', 'hrms-lite/employees')
        safe_name = email.replace('@', '_').replace('.', '_')
        upload_result = cloudinary.uploader.upload(
            photo_file,
            folder=f'{folder_prefix}/admin_avatars',
            public_id=f'avatar_{safe_name}',
            overwrite=True,
            transformation=[
                {'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'},
                {'quality': 'auto', 'fetch_format': 'auto'},
            ]
        )

        logger.info(f'Admin avatar uploaded to Cloudinary: {upload_result["secure_url"]}')
        return Response({
            'message': 'Avatar uploaded successfully to Cloudinary',
            'avatar_url': upload_result['secure_url'],
            'public_id': upload_result['public_id'],
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f'Admin avatar upload failed: {e}')
        return Response({'error': 'Avatar upload to Cloudinary failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

