import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { employeeAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AttendanceControls from '../components/AttendanceControls';
import { GuestBannerConditional } from '../components/GuestBanner';
import './Attendance.css';

function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.total_pages <= 1) return null;
    const { page, total_pages, total, limit } = pagination;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="pagination-bar">
            <span className="pagination-info">
                Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> records
            </span>
            <div className="pagination-controls">
                <button onClick={() => onPageChange(page - 1)} disabled={!pagination.has_prev} className="page-btn">‹ Prev</button>
                <span className="page-current">Page {page} of {total_pages}</span>
                <button onClick={() => onPageChange(page + 1)} disabled={!pagination.has_next} className="page-btn">Next ›</button>
            </div>
        </div>
    );
}

const Attendance = () => {
    const { isGuest } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState(null);
    const LIMIT = 10;

    const fetchData = useCallback(async (currentPage = page, date = filterDate) => {
        try {
            setLoading(true);
            const [empResult, attResult] = await Promise.all([
                employeeAPI.getAll({ page: 1, limit: 100 }),
                attendanceAPI.getAll({ page: currentPage, limit: LIMIT, date }),
            ]);

            const empArr = empResult?.data ?? (Array.isArray(empResult) ? empResult : []);
            setEmployees(empArr);

            if (attResult?.data) {
                setAttendance(attResult.data);
                setPagination(attResult.pagination);
            } else {
                setAttendance(Array.isArray(attResult) ? attResult : []);
                setPagination(null);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [page, filterDate]);

    useEffect(() => { fetchData(page, filterDate); }, [page]);
    useEffect(() => { setPage(1); fetchData(1, filterDate); }, [filterDate]);

    const handleCheckIn = async (employeeId) => {
        if (isGuest) return toast.error('Guest mode: cannot mark attendance');
        try {
            const response = await attendanceAPI.checkIn(employeeId);
            toast.success(response.message || 'Check-in successful!');
            await fetchData(page, filterDate);
        } catch (err) {
            toast.error(err.message || 'Check-in failed');
        }
    };

    const handleCheckOut = async (employeeId) => {
        if (isGuest) return toast.error('Guest mode: cannot mark attendance');
        try {
            const response = await attendanceAPI.checkOut(employeeId);
            toast.success(response.message || 'Check-out successful!');
            await fetchData(page, filterDate);
        } catch (err) {
            toast.error(err.message || 'Check-out failed');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    return (
        <div className="attendance-page">
            <div className="page-header-row">
                <div>
                    <h1>Attendance Management</h1>
                    <p className="page-subtitle">Mark attendance and view records</p>
                </div>
                <div className="attendance-filter">
                    <label>Filter by date</label>
                    <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                    {filterDate && <button onClick={() => setFilterDate('')} className="clear-filter">Clear</button>}
                </div>
            </div>

            <GuestBannerConditional action="marking or modifying attendance" />

            <AttendanceControls employees={employees} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} loading={loading} />

            <div className="attendance-records-container">
                <h2>
                    Attendance Records
                    {pagination && <span className="record-count"> ({pagination.total} total)</span>}
                </h2>

                {loading && <div className="loading">Loading attendance records...</div>}

                {!loading && attendance.length === 0 && (
                    <div className="empty-state">
                        <p>{filterDate ? `No records for ${filterDate}` : 'No attendance records found.'}</p>
                    </div>
                )}

                {!loading && attendance.length > 0 && (
                    <div className="table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record, index) => (
                                    <tr key={`${record.employee_id}-${record.date}-${index}`}>
                                        <td data-label="Employee ID">{record.employee_id}</td>
                                        <td data-label="Name">{record.employee_name || '-'}</td>
                                        <td data-label="Date">{formatDate(record.date)}</td>
                                        <td data-label="Check In">{record.check_in_time || '-'}</td>
                                        <td data-label="Check Out">{record.check_out_time || '-'}</td>
                                        <td data-label="Duration">{record.duration || '-'}</td>
                                        <td data-label="Status">
                                            <span className={`status-badge status-${(record.status || '').toLowerCase().replace(' ', '-')}`}>
                                                {record.status || 'Present'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
        </div>
    );
};

export default Attendance;
