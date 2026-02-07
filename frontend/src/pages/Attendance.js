import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';
import AttendanceControls from '../components/AttendanceControls';
import './Attendance.css';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [employeesData, attendanceData] = await Promise.all([
                employeeAPI.getAll(),
                attendanceAPI.getAll(),
            ]);

            setEmployees(employeesData);
            setAttendance(attendanceData);
        } catch (err) {
            setError(err.error || 'Failed to fetch data');
            console.error('Fetch data error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (employeeId) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await attendanceAPI.checkIn(employeeId);
            setSuccess(response.message || 'Check-in successful!');

            // Refresh attendance data
            await fetchData();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.error || 'Failed to check in');
            console.error('Check-in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async (employeeId) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await attendanceAPI.checkOut(employeeId);
            setSuccess(response.message || 'Check-out successful!');

            // Refresh attendance data
            await fetchData();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.error || err.message || 'Failed to check out');
            console.error('Check-out error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="attendance-page">
            <h1>Attendance Management</h1>
            <p className="page-subtitle">Mark attendance and view records</p>

            {error && (
                <div className="alert alert-error">
                    <span>❌</span> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <span>✅</span> {success}
                </div>
            )}

            <AttendanceControls
                employees={employees}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                loading={loading}
            />

            <div className="attendance-records-container">
                <h2>Attendance Records ({attendance.length})</h2>

                {loading && <div className="loading">Loading attendance records...</div>}

                {!loading && attendance.length === 0 && (
                    <div className="empty-state">
                        <p>No attendance records found. Mark attendance above to get started!</p>
                    </div>
                )}

                {!loading && attendance.length > 0 && (
                    <div className="table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record, index) => (
                                    <tr key={index}>
                                        <td data-label="Employee ID">{record.employee_id}</td>
                                        <td data-label="Date">{formatDate(record.date)}</td>
                                        <td data-label="Check In">{record.check_in_time || '-'}</td>
                                        <td data-label="Check Out">{record.check_out_time || '-'}</td>
                                        <td data-label="Status">
                                            <span className={`status-badge status-${record.status.toLowerCase().replace(' ', '-')}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
