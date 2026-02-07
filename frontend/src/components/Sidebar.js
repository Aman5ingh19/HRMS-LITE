import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const menuItems = [
        { path: '/', icon: '📊', label: 'Dashboard' },
        { path: '/employees', icon: '👥', label: 'Employees' },
        { path: '/attendance', icon: '✓', label: 'Attendance' },
        { path: '/reports', icon: '📈', label: 'Reports' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <div className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-logo">
                <div className="logo-icon">🏢</div>
                <div className="logo-text">
                    <span className="logo-title">HRMS</span>
                    <span className="logo-subtitle">Lite</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    {menuItems.map((item) => (
                        <li key={item.path} className="sidebar-item">
                            <Link
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path)}`}
                            >
                                <span className="sidebar-icon">{item.icon}</span>
                                <span className="sidebar-label">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="sidebar-bottom">
                <div className="sidebar-divider"></div>

                <Link to="/help" className="sidebar-link">
                    <span className="sidebar-icon">❓</span>
                    <span className="sidebar-label">Help Center</span>
                </Link>

                <Link to="/logout" className="sidebar-link">
                    <span className="sidebar-icon">🚪</span>
                    <span className="sidebar-label">Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
