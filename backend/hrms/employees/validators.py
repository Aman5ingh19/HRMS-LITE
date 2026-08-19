"""
Pydantic-based schema validators (Zod-equivalent for Python).
Provides strict validation with detailed error messages for all API inputs.
"""

from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
import re


class EmployeeCreateSchema(BaseModel):
    """Validates employee creation payload."""
    employee_id: str
    full_name: str
    email: str
    department: str
    phone: Optional[str] = None
    position: Optional[str] = None
    salary: Optional[float] = None
    join_date: Optional[str] = None
    profile_photo_url: Optional[str] = None

    @field_validator('employee_id')
    @classmethod
    def validate_employee_id(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('employee_id cannot be empty')
        if len(v) < 3:
            raise ValueError('employee_id must be at least 3 characters')
        if not re.match(r'^[A-Za-z0-9_-]+$', v):
            raise ValueError('employee_id can only contain letters, numbers, hyphens, and underscores')
        return v.upper()

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('full_name cannot be empty')
        if len(v) < 2:
            raise ValueError('full_name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('full_name cannot exceed 100 characters')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email address format')
        return v

    @field_validator('department')
    @classmethod
    def validate_department(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('department cannot be empty')
        if len(v) < 2:
            raise ValueError('department must be at least 2 characters')
        return v

    @field_validator('salary')
    @classmethod
    def validate_salary(cls, v):
        if v is not None and v < 0:
            raise ValueError('salary must be a positive number')
        return v

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        if v is not None:
            v = v.strip()
            digits = re.sub(r'[\s\-\+\(\)]', '', v)
            if len(digits) < 10:
                raise ValueError('phone number must have at least 10 digits')
        return v


class AttendanceCheckInSchema(BaseModel):
    """Validates attendance check-in payload."""
    employee_id: str

    @field_validator('employee_id')
    @classmethod
    def validate_employee_id(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('employee_id is required')
        return v.upper()


class AttendanceCheckOutSchema(BaseModel):
    """Validates attendance check-out payload."""
    employee_id: str

    @field_validator('employee_id')
    @classmethod
    def validate_employee_id(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('employee_id is required')
        return v.upper()


def format_pydantic_errors(exc):
    """Convert Pydantic ValidationError into a clean dict for API responses."""
    errors = {}
    for error in exc.errors():
        field = error['loc'][0] if error['loc'] else 'general'
        errors[str(field)] = error['msg'].replace('Value error, ', '')
    return errors
