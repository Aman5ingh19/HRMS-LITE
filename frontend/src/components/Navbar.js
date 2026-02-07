import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to employees page with search query
            navigate(`/employees?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-wrapper">
                        <span className="logo-icon">🏢</span>
                        <div className="logo-text">
                            <span className="logo-title">HRMS</span>
                            <span className="logo-subtitle">Lite</span>
                        </div>
                    </div>
                </Link>

                {/* Search Bar */}
                <div className={`navbar-search ${isSearchFocused ? 'focused' : ''}`}>
                    <form onSubmit={handleSearch}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search employees, attendance..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </form>
                </div>

                {/* Navigation Menu */}
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className={`navbar-link ${isActive('/')}`}>
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Dashboard</span>
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/employees" className={`navbar-link ${isActive('/employees')}`}>
                            <span className="nav-icon">👥</span>
                            <span className="nav-text">Employees</span>
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/attendance" className={`navbar-link ${isActive('/attendance')}`}>
                            <span className="nav-icon">✓</span>
                            <span className="nav-text">Attendance</span>
                        </Link>
                    </li>
                </ul>

                {/* User Profile */}
                <div className="navbar-profile">
                    <div className="profile-avatar">
                        <span>A</span>
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">Admin</span>
                        <span className="profile-role">Administrator</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
