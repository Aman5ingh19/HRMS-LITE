import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({ employees, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="employee-table-container">
                <h2>Employee List</h2>
                <div className="loading">Loading employees...</div>
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="employee-table-container">
                <h2>Employee List</h2>
                <div className="empty-state">
                    <p>No employees found. Add your first employee above!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-table-container">
            <h2>Employee List ({employees.length})</h2>
            <div className="table-wrapper">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.employee_id}>
                                <td data-label="Employee ID">{employee.employee_id}</td>
                                <td data-label="Full Name">{employee.full_name}</td>
                                <td data-label="Email">{employee.email}</td>
                                <td data-label="Department">
                                    <span className="department-badge">{employee.department}</span>
                                </td>
                                <td data-label="Actions">
                                    <button
                                        onClick={() => onDelete(employee.employee_id)}
                                        className="btn-delete"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;
