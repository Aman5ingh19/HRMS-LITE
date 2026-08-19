import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, CheckSquare, HelpCircle, LogOut,
    Building2, Info, BookOpen, Eye, Settings
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isGuest, logoutGuest } = useAuth();
    const clerk = useClerk();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = async (e) => {
        e.preventDefault();
        if (isGuest) {
            logoutGuest();
        } else if (clerk?.signOut) {
            try {
                await clerk.signOut();
            } catch (err) {
                console.error('Sign out error:', err);
            }
        }
        navigate('/login');
    };

    // Main navigation items — visible to everyone (guest & admin)
    const mainMenuItems = [
        { path: '/',           icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employees',  icon: Users,           label: 'Employees' },
        { path: '/attendance', icon: CheckSquare,     label: 'Attendance' },
    ];

    // Info & Configuration section — visible to everyone
    const infoMenuItems = [
        { path: '/how-to-use', icon: BookOpen,   label: 'How to Use' },
        { path: '/about',      icon: Info,        label: 'About' },
        { path: '/help',       icon: HelpCircle,  label: 'Help Centre' },
        { path: '/settings',   icon: Settings,    label: 'Settings' },
    ];

    return (
        <>
        {/* Mobile Overlay */}
        <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onToggle} />

        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <Building2 className="logo-icon" size={32} />
                <div className="logo-text">
                    <span className="logo-title">HRMS</span>
                    <span className="logo-subtitle">Lite</span>
                </div>
            </div>

            {/* Guest Badge */}
            {isGuest && (
                <div className="sidebar-guest-badge">
                    <Eye size={13} />
                    <span>Guest — View Only</span>
                </div>
            )}

            <nav className="sidebar-nav">
                {/* Main section */}
                <p className="sidebar-section-label">Main</p>
                <ul className="sidebar-menu">
                    {mainMenuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.path} className="sidebar-item">
                                <Link
                                    to={item.path}
                                    className={`sidebar-link ${isActive(item.path)}`}
                                >
                                    <IconComponent className="sidebar-icon" size={20} />
                                    <span className="sidebar-label">{item.label}</span>
                                    {isGuest && (
                                        <Eye size={11} className="sidebar-guest-eye" title="View only" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Info section */}
                <p className="sidebar-section-label" style={{ marginTop: '18px' }}>Info</p>
                <ul className="sidebar-menu">
                    {infoMenuItems.map((item) => {
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
                <div className="sidebar-divider" />
                <button
                    onClick={(e) => {
                        handleLogout(e);
                        if (window.innerWidth <= 768 && isOpen) onToggle();
                    }}
                    className="sidebar-link sidebar-logout-btn"
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                    <LogOut className="sidebar-icon" size={20} />
                    <span className="sidebar-label">{isGuest ? 'Exit Guest Mode' : 'Logout'}</span>
                </button>
            </div>
        </div>
        </>
    );
};

export default Sidebar;
