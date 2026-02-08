import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, BarChart3, Settings, HelpCircle, LogOut, Building2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employees', icon: Users, label: 'Employees' },
        { path: '/attendance', icon: CheckSquare, label: 'Attendance' },
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <Building2 className="logo-icon" size={32} />
                <div className="logo-text">
                    <span className="logo-title">HRMS</span>
                    <span className="logo-subtitle">Lite</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.path} className="sidebar-item">
                                <Link
                                    to={item.path}
                                    className={`sidebar-link ${isActive(item.path)}`}
                                >
                                    <IconComponent className="sidebar-icon" size={20} />
                                    <span className="sidebar-label">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-divider"></div>

                <Link to="/help" className="sidebar-link">
                    <HelpCircle className="sidebar-icon" size={20} />
                    <span className="sidebar-label">Help Center</span>
                </Link>

                <Link to="/logout" className="sidebar-link">
                    <LogOut className="sidebar-icon" size={20} />
                    <span className="sidebar-label">Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
