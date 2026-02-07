from rest_framework.decorators import api_view
from rest_framework.response import Response
from hrms.mongo import employees_collection, attendance_collection
from datetime import datetime


@api_view(['GET'])
def get_all_attendance(request):
    """Get all attendance records from MongoDB"""
    attendance_records = list(attendance_collection.find({}, {"_id": 0}))
    return Response(attendance_records, status=200)


@api_view(['GET'])
def get_employee_attendance(request, employee_id):
    """Get attendance records for a specific employee"""
    attendance_records = list(
        attendance_collection.find({"employee_id": employee_id}, {"_id": 0})
    )
    return Response(attendance_records, status=200)


@api_view(['POST'])
def check_in(request):
    """Record employee check-in time"""
    # Read employee_id from request.data
    employee_id = request.data.get("employee_id")
    
    # Validate employee_id is provided
    if not employee_id:
        return Response({"error": "employee_id is required"}, status=400)
    
    # Verify employee exists in employees_collection
    employee = employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        return Response({"error": "Employee not found"}, status=404)
    
    # Generate today's date and current time
    today = datetime.now().strftime("%Y-%m-%d")
    current_time = datetime.now().strftime("%H:%M:%S")
    
    # Check if attendance record already exists for today
    existing_record = attendance_collection.find_one({
        "employee_id": employee_id,
        "date": today
    })
    
    if existing_record:
        return Response({"message": "Already checked in"}, status=200)
    
    # Insert new attendance record
    attendance_record = {
        "employee_id": employee_id,
        "date": today,
        "check_in_time": current_time,
        "check_out_time": "",
        "status": "Present"
    }
    
    attendance_collection.insert_one(attendance_record)
    
    return Response({"message": "Check-in successful"}, status=200)


@api_view(['POST'])
def check_out(request):
    """Record employee check-out time"""
    # Read employee_id from request.data
    employee_id = request.data.get("employee_id")
    
    # Validate employee_id is provided
    if not employee_id:
        return Response({"error": "employee_id is required"}, status=400)
    
    # Generate today's date and current time
    today = datetime.now().strftime("%Y-%m-%d")
    current_time = datetime.now().strftime("%H:%M:%S")
    
    # Find today's attendance record
    existing_record = attendance_collection.find_one({
        "employee_id": employee_id,
        "date": today
    })
    
    # Check if check-in exists
    if not existing_record:
        return Response({"message": "Check-in required first"}, status=400)
    
    # Check if already checked out
    if existing_record.get("check_out_time") and existing_record.get("check_out_time") != "":
        return Response({"message": "Already checked out"}, status=200)
    
    # Update record with check-out time
    attendance_collection.update_one(
        {"employee_id": employee_id, "date": today},
        {"$set": {"check_out_time": current_time}}
    )
    
    return Response({"message": "Check-out successful"}, status=200)
