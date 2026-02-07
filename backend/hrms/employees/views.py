from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from hrms.mongo import employees_collection


@api_view(['GET'])
def get_employees(request):
    """Get all employees from MongoDB"""
    employees = list(employees_collection.find({}, {"_id": 0}))
    return Response(employees, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_employee(request):
    """Add a new employee to MongoDB"""
    data = request.data

    required_fields = ["employee_id", "full_name", "email", "department"]
    for field in required_fields:
        if field not in data or data[field] == "":
            return Response(
                {"error": f"{field} is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    # Check for duplicate employee_id
    existing = employees_collection.find_one({"employee_id": data["employee_id"]})
    if existing:
        return Response(
            {"error": "Employee already exists"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    employees_collection.insert_one(data)
    return Response(
        {"message": "Employee added successfully"}, 
        status=status.HTTP_201_CREATED
    )


@api_view(['DELETE'])
def delete_employee(request, emp_id):
    """Delete an employee from MongoDB by employee_id"""
    result = employees_collection.delete_one({"employee_id": emp_id})
    if result.deleted_count == 0:
        return Response(
            {"error": "Employee not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {"message": "Employee deleted"}, 
        status=status.HTTP_200_OK
    )

