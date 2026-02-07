import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        totalAttendance: 0,
        absentToday: 0,
        attendanceRate: 0,
        newMembers: 0,
        jobApplicants: 0,
    });
    const [employees, setEmployees] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [employeesData, attendanceRecords] = await Promise.all([
                employeeAPI.getAll(),
                attendanceAPI.getAll(),
            ]);

            const today = new Date().toISOString().split('T')[0];
            const presentToday = attendanceRecords.filter(
                (record) => record.date === today && record.status === 'Present'
            ).length;

            const absentToday = employeesData.length - presentToday;
            const attendanceRate = employeesData.length > 0
                ? ((presentToday / employeesData.length) * 100).toFixed(1)
                : 0;

            setStats({
                totalEmployees: employeesData.length,
                presentToday: presentToday,
                totalAttendance: attendanceRecords.length,
                absentToday: absentToday,
                attendanceRate: attendanceRate,
                newMembers: Math.floor(employeesData.length * 0.1),
                jobApplicants: Math.floor(employeesData.length * 0.3),
            });
            setEmployees(employeesData.slice(0, 5));
            setAttendanceData(attendanceRecords);
        } catch (err) {
            setError(err.error || 'Failed to load dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDepartmentStats = () => {
        const departments = ['IT', 'HR', 'Sales', 'Marketing'];
        return departments.map(dept => {
            const count = employees.filter(emp => emp.department === dept).length;
            return { name: dept, count };
        });
    };

    // Calendar Functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getAttendanceForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const records = attendanceData.filter(record => record.date === dateStr);
        const present = records.filter(r => r.status === 'Present').length;
        const total = stats.totalEmployees;

        if (total === 0) return { status: 'none', percentage: 0 };

        const percentage = (present / total) * 100;

        if (percentage === 0) return { status: 'none', percentage: 0 };
        if (percentage < 50) return { status: 'low', percentage };
        if (percentage < 80) return { status: 'medium', percentage };
        return { status: 'high', percentage };
    };

    const changeMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
        const days = [];
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const { status, percentage } = getAttendanceForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${status} ${isToday ? 'today' : ''}`}
                    title={`${percentage.toFixed(0)}% attendance`}
                >
                    <span className="day-number">{day}</span>
                    {status !== 'none' && (
                        <div className="attendance-indicator">
                            <div className="indicator-dot"></div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <>
                <div className="calendar-weekdays">
                    {weekDays.map(day => (
                        <div key={day} className="weekday">{day}</div>
                    ))}
                </div>
                <div className="calendar-grid">
                    {days}
                </div>
            </>
        );
    };

    if (loading) {
        return (
            <div className="dashboard-new">
                <div className="skeleton-loader">
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-new">
                <div className="error-container">
                    <span className="error-icon">⚠️</span>
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchDashboardData} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const departmentStats = getDepartmentStats();
    const totalDeptCount = departmentStats.reduce((sum, dept) => sum + dept.count, 0);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="dashboard-new">
            {/* Stats Cards Row */}
            <div className="stats-row">
                <div className="stat-card-new stat-primary">
                    <div className="stat-icon-wrapper">
                        <span className="stat-icon-new">👥</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">Total Employees</span>
                        <h2 className="stat-value">{stats.totalEmployees}</h2>
                        <span className="stat-change positive">↑ 25.5%</span>
                    </div>
                </div>

                <div className="stat-card-new stat-success">
                    <div className="stat-icon-wrapper">
                        <span className="stat-icon-new">📋</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">Job Applicants</span>
                        <h2 className="stat-value">{stats.jobApplicants}</h2>
                        <span className="stat-change negative">↓ 10.8%</span>
                    </div>
                </div>

                <div className="stat-card-new stat-warning">
                    <div className="stat-icon-wrapper">
                        <span className="stat-icon-new">👤</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">New Members</span>
                        <h2 className="stat-value">{stats.newMembers}</h2>
                        <span className="stat-change positive">↑ 15.8%</span>
                    </div>
                </div>

                <div className="stat-card-new stat-info">
                    <div className="stat-icon-wrapper">
                        <span className="stat-icon-new">✓</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">Resigned Members</span>
                        <h2 className="stat-value">{stats.absentToday}</h2>
                        <span className="stat-change positive">↑ 25.5%</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Attendance Calendar */}
                <div className="dashboard-card calendar-card">
                    <div className="card-header-new">
                        <h3>📅 Attendance Calendar</h3>
                        <div className="calendar-controls">
                            <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
                                ‹
                            </button>
                            <span className="calendar-month-year">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>
                                ›
                            </button>
                        </div>
                    </div>
                    <div className="calendar-container">
                        {renderCalendar()}
                        <div className="calendar-legend">
                            <div className="legend-item-cal">
                                <span className="legend-dot-cal high"></span>
                                <span>High (80%+)</span>
                            </div>
                            <div className="legend-item-cal">
                                <span className="legend-dot-cal medium"></span>
                                <span>Medium (50-80%)</span>
                            </div>
                            <div className="legend-item-cal">
                                <span className="legend-dot-cal low"></span>
                                <span>Low (&lt;50%)</span>
                            </div>
                            <div className="legend-item-cal">
                                <span className="legend-dot-cal none"></span>
                                <span>No Data</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Employees Donut Chart */}
                <div className="dashboard-card donut-card">
                    <div className="card-header-new">
                        <h3>Total Employees</h3>
                        <button className="filter-btn">All Member</button>
                    </div>
                    <div className="donut-chart-container">
                        <div className="donut-chart">
                            <svg viewBox="0 0 100 100" className="donut-svg">
                                {departmentStats.map((dept, index) => {
                                    const percentage = totalDeptCount > 0 ? (dept.count / totalDeptCount) * 100 : 0;
                                    const colors = ['#667eea', '#48bb78', '#f6ad55', '#9f7aea'];
                                    const offset = departmentStats.slice(0, index).reduce((sum, d) => {
                                        return sum + (totalDeptCount > 0 ? (d.count / totalDeptCount) * 100 : 0);
                                    }, 0);

                                    return (
                                        <circle
                                            key={dept.name}
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke={colors[index]}
                                            strokeWidth="20"
                                            strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                                            strokeDashoffset={-offset * 2.51}
                                            transform="rotate(-90 50 50)"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="donut-center">
                                <h2>{stats.totalEmployees}</h2>
                                <span>Total Emp.</span>
                            </div>
                        </div>
                        <div className="donut-legend">
                            {departmentStats.map((dept, index) => {
                                const colors = ['#667eea', '#48bb78', '#f6ad55', '#9f7aea'];
                                return (
                                    <div key={dept.name} className="legend-item-donut">
                                        <span className="legend-dot-donut" style={{ background: colors[index] }}></span>
                                        <span className="legend-text">{dept.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Employees Table */}
            <div className="dashboard-card employees-table-card">
                <div className="card-header-new">
                    <h3>Employees</h3>
                    <div className="table-filters">
                        <select className="filter-select">
                            <option>All office</option>
                            <option>IT</option>
                            <option>HR</option>
                        </select>
                        <select className="filter-select">
                            <option>All job titles</option>
                            <option>Developer</option>
                            <option>Designer</option>
                        </select>
                        <select className="filter-select">
                            <option>All status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="employees-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Job Title</th>
                                <th>User Manager</th>
                                <th>Department</th>
                                <th>Office</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="employee-cell">
                                            <div className="employee-avatar">
                                                {emp.full_name?.charAt(0) || '?'}
                                            </div>
                                            <span>{emp.full_name}</span>
                                        </div>
                                    </td>
                                    <td>{emp.email?.split('@')[0] || 'N/A'}</td>
                                    <td>@{emp.employee_id}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <span className="office-badge">{Math.floor(Math.random() * 30) + 1} days</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
