"""
Fix historical timestamps in MongoDB to align with IST (Asia/Kolkata).
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'hrms'))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', 'hrms', '.env'))

from hrms.mongo import attendance_collection, employees_collection

def fix_records():
    # Update Nikhil (420)
    attendance_collection.update_one(
        {'employee_id': '420', 'date': '2026-09-14'},
        {'$set': {'check_in_time': '10:27:17', 'check_out_time': '11:11:42'}}
    )
    employees_collection.update_one(
        {'employee_id': '420'},
        {'$set': {
            'created_at': '2026-09-14 10:25:30',
            'created_date': '2026-09-14',
            'created_time': '10:25:30 AM',
            'join_date': '2026-09-14'
        }}
    )

    # Update AMAN SINGH (EMP001)
    attendance_collection.update_one(
        {'employee_id': 'EMP001', 'date': '2026-08-20'},
        {'$set': {'check_in_time': '09:09:39', 'check_out_time': '09:10:08'}}
    )
    employees_collection.update_one(
        {'employee_id': 'EMP001'},
        {'$set': {
            'created_at': '2026-08-20 09:05:00',
            'created_date': '2026-08-20',
            'created_time': '09:05:00 AM',
            'join_date': '2026-08-20'
        }}
    )

    print("✅ Fixed attendance records:")
    for doc in attendance_collection.find({}, {'_id': 0}):
        print("  Attendance:", doc)

    print("✅ Fixed employee records:")
    for doc in employees_collection.find({}, {'_id': 0}):
        print("  Employee:", doc)

if __name__ == '__main__':
    fix_records()
