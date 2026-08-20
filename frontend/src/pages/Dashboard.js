import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
    Users, UserCheck, UserX, ClipboardList, 
    AlertTriangle, Calendar, ChevronLeft, ChevronRight, 
    Eye, UserPlus
} from 'lucide-react';
import './Dashboard.css';

const DEPARTMENT_COLORS = {
    'IT': '#667eea',
    'HR': '#48bb78',
    'Finance': '#f6ad55',
    'Marketing': '#9f7aea',
    'Sales': '#38b2ac',
    'Engineering': '#3182ce',
    'Operations': '#e53e3e',
    'Design': '#ed64a6',
    'General': '#a0aec0',
};

// Local date string formatter YYYY-MM-DD (immune to UTC timezone day-shifts)
const formatLocalDate = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Dashboard = () => {
    const { isGuest } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        totalAttendance: 0,
        absentToday: 0,
        attendanceRate: 0,
    });
    const [allEmployees, setAllEmployees] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Department filter for employee table
    const [selectedDept, setSelectedDept] = useState('All');

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [employeesData, attendanceRecords] = await Promise.all([
                employeeAPI.getAll({ limit: 100 }),
                attendanceAPI.getAll({ limit: 500 }),
            ]);

            // Handle both paginated and raw array responses
            const empArr = Array.isArray(employeesData)
                ? employeesData
                : (employeesData?.data ?? []);
            const attArr = Array.isArray(attendanceRecords)
                ? attendanceRecords
                : (attendanceRecords?.data ?? []);

            const today = formatLocalDate(new Date());
            const presentToday = attArr.filter(
                (record) => record.date === today && record.status === 'Present'
            ).length;

            const absentToday = Math.max(0, empArr.length - presentToday);
            const attendanceRate = empArr.length > 0
                ? ((presentToday / empArr.length) * 100).toFixed(1)
                : 0;

            setStats({
                totalEmployees: empArr.length,
                presentToday: presentToday,
                totalAttendance: attArr.length,
                absentToday: absentToday,
                attendanceRate: attendanceRate,
            });

            setAllEmployees(empArr);
            setAttendanceData(attArr);
        } catch (err) {
            if (isGuest) {
                setError(null);
            } else {
                setError(err?.error || err?.message || 'Failed to load dashboard data');
            }
            console.warn('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [isGuest]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Calculate REAL department breakdown from MongoDB data
    const getDepartmentStats = () => {
        if (!allEmployees || allEmployees.length === 0) {
            return [];
        }

        const counts = {};
        allEmployees.forEach(emp => {
            const dept = emp.department || 'General';
            counts[dept] = (counts[dept] || 0) + 1;
        });

        return Object.keys(counts).map(dept => ({
            name: dept,
            count: counts[dept],
            color: DEPARTMENT_COLORS[dept] || '#818cf8',
        }));
    };

    // Calendar Helper Functions
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
        const dateStr = formatLocalDate(date);
        const records = attendanceData.filter(record => record.date === dateStr);
        const present = records.filter(r => r.status === 'Present').length;
        const total = stats.totalEmployees;

        if (total === 0 || records.length === 0) return { status: 'none', percentage: 0 };

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
        const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.toDateString() === today.toDateString();
            const { status, percentage } = getAttendanceForDate(currentDate);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${status} ${isToday ? 'today' : ''}`}
                    title={status !== 'none' ? `${percentage.toFixed(0)}% attendance (${day}/${month + 1}/${year})` : `No records for ${day}/${month + 1}/${year}`}
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
                    <AlertTriangle className="error-icon" size={64} />
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
    const totalDeptCount = stats.totalEmployees;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Today's date string
    const todayStr = formatLocalDate(new Date());

    // Filter employees for the recent table
    const displayedEmployees = selectedDept === 'All'
        ? allEmployees
        : allEmployees.filter(emp => emp.department === selectedDept);

    return (
        <div className="dashboard-new">
            {/* Guest info note */}
            {isGuest && (
                <div className="dashboard-guest-note">
                    <Eye size={16} />
                    <span>You are viewing the dashboard in <strong>Guest Mode</strong>. Data displayed is live from MongoDB Atlas.</span>
                </div>
            )}

            {/* ── Real Stats Row (100% accurate MongoDB calculations) ── */}
            <div className="stats-row">
                {/* 1. Total Employees */}
                <div className="stat-card-new stat-primary">
                    <div className="stat-icon-wrapper">
                        <Users className="stat-icon-new" size={28} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">Total Employees</span>
                        <h2 className="stat-value">{stats.totalEmployees}</h2>
                        <span className="stat-change positive">
                            {stats.totalEmployees === 0 ? 'No employees yet' : `${stats.totalEmployees} Active in Database`}
                        </span>
                    </div>
                </div>

                {/* 2. Present Today */}
                <div className="stat-card-new stat-success">
                    <div className="stat-icon-wrapper">
                        <UserCheck className="stat-icon-new" size={28} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">Present Today</span>
                        <h2 className="stat-value">{stats.presentToday}</h2>
                        <span className="stat-change positive">
                            {stats.totalEmployees > 0 ? `${stats.attendanceRate}% Attendance Rate` : 'No check-ins today'}
                        </span>
                    </div>
                </div>

                {/* 3. Absent Today */}
                <div className="stat-card-new stat-warning">
                    <div className="stat-icon-wrapper">
                        <UserX className="stat-icon-new" size={28} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">Absent / Not Marked</span>
                        <h2 className="stat-value">{stats.absentToday}</h2>
                        <span className="stat-change negative">
                            {stats.totalEmployees > 0 ? `${stats.absentToday} Pending check-in` : '0 Pending'}
                        </span>
                    </div>
                </div>

                {/* 4. Total Attendance Records */}
                <div className="stat-card-new stat-info">
                    <div className="stat-icon-wrapper">
                        <ClipboardList className="stat-icon-new" size={28} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label-new">Total Logs Recorded</span>
                        <h2 className="stat-value">{stats.totalAttendance}</h2>
                        <span className="stat-change positive">
                            {stats.totalAttendance} Logged Entries
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Main Dashboard Grid ── */}
            <div className="dashboard-grid">
                {/* Attendance Calendar */}
                <div className="dashboard-card calendar-card">
                    <div className="card-header-new">
                        <h3><Calendar size={20} style={{ display: 'inline', marginRight: '8px' }} /> Attendance Calendar</h3>
                        <div className="calendar-controls">
                            <button className="calendar-nav-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="calendar-month-year">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button className="calendar-nav-btn" onClick={() => changeMonth(1)} aria-label="Next month">
                                <ChevronRight size={20} />
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
                                <span>No Records</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real Total Employees Donut Chart */}
                <div className="dashboard-card donut-card">
                    <div className="card-header-new">
                        <h3>Department Breakdown</h3>
                        <Link to="/employees" className="filter-btn">View All</Link>
                    </div>
                    <div className="donut-chart-container">
                        {stats.totalEmployees === 0 ? (
                            <div className="donut-empty-state">
                                <Users size={40} className="empty-icon" />
                                <p>No employees registered yet</p>
                                <Link to="/employees" className="add-emp-quick-link">
                                    <UserPlus size={14} /> Add First Employee
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="donut-chart">
                                    <svg viewBox="0 0 100 100" className="donut-svg">
                                        {departmentStats.map((dept, index) => {
                                            const percentage = totalDeptCount > 0 ? (dept.count / totalDeptCount) * 100 : 0;
                                            const offset = departmentStats.slice(0, index).reduce((sum, d) => {
                                                return sum + (totalDeptCount > 0 ? (d.count / totalDeptCount) * 100 : 0);
                                            }, 0);

                                            if (percentage === 0) return null;

                                            const dash = Math.max(0, percentage * 2.51);
                                            const gap = Math.max(0, 251 - dash);

                                            return (
                                                <circle
                                                    key={dept.name}
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke={dept.color}
                                                    strokeWidth="20"
                                                    strokeDasharray={`${dash} ${gap}`}
                                                    strokeDashoffset={-offset * 2.51}
                                                    transform="rotate(-90 50 50)"
                                                />
                                            );
                                        })}
                                    </svg>
                                    <div className="donut-center">
                                        <h2>{stats.totalEmployees}</h2>
                                        <span>Total Staff</span>
                                    </div>
                                </div>
                                <div className="donut-legend">
                                    {departmentStats.map((dept) => {
                                        const pct = totalDeptCount > 0 ? ((dept.count / totalDeptCount) * 100).toFixed(0) : 0;
                                        return (
                                            <div key={dept.name} className="legend-item-donut">
                                                <span className="legend-dot-donut" style={{ background: dept.color }}></span>
                                                <span className="legend-text">
                                                    <strong>{dept.name}</strong> ({dept.count} • {pct}%)
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Real Registered Employees Table ── */}
            <div className="dashboard-card employees-table-card">
                <div className="card-header-new">
                    <h3>Recent Personnel ({displayedEmployees.length})</h3>
                    <div className="table-filters">
                        <select 
                            className="filter-select" 
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="All">All Departments</option>
                            {departmentStats.map(d => (
                                <option key={d.name} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {displayedEmployees.length === 0 ? (
                    <div className="dashboard-table-empty">
                        <Users size={36} />
                        <p>No employees found in database.</p>
                        <Link to="/employees" className="add-emp-btn-small">
                            <UserPlus size={14} /> Add Employee
                        </Link>
                    </div>
                ) : (
                    <div className="employees-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Employee ID</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Today's Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedEmployees.slice(0, 8).map((emp, index) => {
                                    // Check if this employee is marked Present today
                                    const isPresentToday = attendanceData.some(
                                        rec => rec.employee_id === emp.employee_id && rec.date === todayStr && rec.status === 'Present'
                                    );

                                    return (
                                        <tr key={emp.employee_id || index}>
                                            <td>
                                                <div className="employee-cell">
                                                    <div className="employee-avatar">
                                                        {emp.profile_photo_url ? (
                                                            <img src={emp.profile_photo_url} alt={emp.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <span>{emp.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                                                        )}
                                                    </div>
                                                    <span className="employee-name-text">{emp.full_name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="emp-id-badge">{emp.employee_id}</span>
                                            </td>
                                            <td>
                                                <span 
                                                    className="dept-pill"
                                                    style={{ 
                                                        background: `${DEPARTMENT_COLORS[emp.department] || '#667eea'}15`,
                                                        color: DEPARTMENT_COLORS[emp.department] || '#667eea',
                                                        borderColor: `${DEPARTMENT_COLORS[emp.department] || '#667eea'}40`,
                                                    }}
                                                >
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="emp-email-cell">{emp.email}</td>
                                            <td>
                                                <span className={`attendance-status-badge ${isPresentToday ? 'present' : 'unmarked'}`}>
                                                    {isPresentToday ? '● Present Today' : '○ Not Marked'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
