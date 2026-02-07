import React, { useState } from 'react';
import './AttendanceControls.css';

const AttendanceControls = ({ employees, onCheckIn, onCheckOut, loading }) => {
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const handleCheckIn = () => {
        if (!selectedEmployee) {
            alert('Please select an employee');
            return;
        }
        onCheckIn(selectedEmployee);
    };

    const handleCheckOut = () => {
        if (!selectedEmployee) {
            alert('Please select an employee');
            return;
        }
        onCheckOut(selectedEmployee);
    };

    return (
        <div className="attendance-controls-container">
            <h2>Mark Attendance</h2>
            <div className="controls-content">
                <div className="employee-select-group">
                    <label htmlFor="employee-select">Select Employee</label>
                    <select
                        id="employee-select"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">-- Select Employee --</option>
                        {employees.map((emp) => (
                            <option key={emp.employee_id} value={emp.employee_id}>
                                {emp.employee_id} - {emp.full_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="action-buttons">
                    <button
                        onClick={handleCheckIn}
                        className="btn btn-check-in"
                        disabled={loading || !selectedEmployee}
                    >
                        <span className="btn-icon">✅</span>
                        Check In
                    </button>
                    <button
                        onClick={handleCheckOut}
                        className="btn btn-check-out"
                        disabled={loading || !selectedEmployee}
                    >
                        <span className="btn-icon"></span>
                        Check Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceControls;
