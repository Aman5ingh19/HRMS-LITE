import React from 'react';
import { Calendar, Clock, Trash2, Mail, User } from 'lucide-react';
import './EmployeeTable.css';

const formatDateTime = (employee) => {
    // If created_at exists (e.g. "2026-09-14 10:35:00" or ISO)
    if (employee.created_at) {
        const d = new Date(employee.created_at);
        if (!isNaN(d.getTime())) {
            return {
                date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
            };
        }
        // string split fallback
        const parts = employee.created_at.split(' ');
        if (parts.length >= 2) {
            return { date: parts[0], time: parts[1] };
        }
    }

    if (employee.created_date) {
        return {
            date: employee.created_date,
            time: employee.created_time || '-'
        };
    }

    if (employee.join_date) {
        return {
            date: employee.join_date,
            time: '-'
        };
    }

    return { date: 'Recently Added', time: '-' };
};

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
            <div className="employee-table-header-row">
                <h2>Employee Roster ({employees.length})</h2>
                <span className="table-subtitle">Live workforce records from MongoDB Atlas</span>
            </div>
            
            <div className="table-wrapper">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Added Date & Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => {
                            const dt = formatDateTime(employee);
                            return (
                                <tr key={employee.employee_id}>
                                    <td data-label="Employee">
                                        <div className="emp-identity-cell">
                                            <div className="emp-avatar-circle">
                                                {employee.profile_photo_url ? (
                                                    <img src={employee.profile_photo_url} alt={employee.full_name} className="emp-photo-img" />
                                                ) : (
                                                    <span>{(employee.full_name || 'E').charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="emp-names">
                                                <strong className="emp-name-text">{employee.full_name}</strong>
                                                <span className="emp-id-badge">{employee.employee_id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Email">
                                        <div className="emp-email-cell">
                                            <Mail size={13} className="cell-icon" />
                                            <span>{employee.email}</span>
                                        </div>
                                    </td>
                                    <td data-label="Department">
                                        <span className="department-badge">{employee.department}</span>
                                    </td>
                                    <td data-label="Added Date & Time">
                                        <div className="datetime-badge-group">
                                            <div className="datetime-pill date">
                                                <Calendar size={12} />
                                                <span>{dt.date}</span>
                                            </div>
                                            {dt.time && dt.time !== '-' && (
                                                <div className="datetime-pill time">
                                                    <Clock size={12} />
                                                    <span>{dt.time}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td data-label="Actions">
                                        <button
                                            onClick={() => onDelete(employee.employee_id)}
                                            className="btn-delete"
                                            disabled={loading}
                                            title="Delete employee"
                                        >
                                            <Trash2 size={14} />
                                            <span>Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;
