import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, CheckSquare, HelpCircle, LogOut,
    Building2, Info, BookOpen, Eye, Settings, X
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

    const handleLinkClick = () => {
        if (window.innerWidth <= 1024 && isOpen && onToggle) {
            onToggle();
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        if (window.innerWidth <= 1024 && isOpen && onToggle) {
            onToggle();
        }
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
        <div 
            className={`sidebar-overlay ${isOpen ? 'show' : ''}`} 
            onClick={onToggle} 
            aria-hidden="true"
        />

        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo Section */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-brand">
                    <Building2 className="logo-icon" size={30} />
                    <div className="logo-text">
                        <span className="logo-title">HRMS</span>
                        <span className="logo-subtitle">Lite</span>
                    </div>
                </div>
                {/* Mobile Drawer Close Button */}
                <button 
                    className="sidebar-close-btn" 
                    onClick={onToggle} 
                    aria-label="Close sidebar menu"
                >
                    <X size={20} />
                </button>
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
                                    onClick={handleLinkClick}
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
                                    onClick={handleLinkClick}
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
                    onClick={handleLogout}
                    className="sidebar-link sidebar-logout-btn"
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
