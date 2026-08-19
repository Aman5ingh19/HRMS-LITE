import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Sun, Moon, Menu, User, Settings, 
    LogOut, ChevronDown, Shield, Key,
    LayoutDashboard, Users, CheckSquare, BookOpen,
    HelpCircle, Info, ArrowRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useClerk } from '@clerk/clerk-react';
import { employeeAPI } from '../services/api';
import './TopBar.css';

const APP_ROUTES = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Pages', desc: 'Main overview, attendance calendar & department stats' },
    { title: 'Employees', path: '/employees', icon: Users, category: 'Pages', desc: 'Manage workforce directory and staff details' },
    { title: 'Attendance', path: '/attendance', icon: CheckSquare, category: 'Pages', desc: 'Mark check-ins and review attendance records' },
    { title: 'Admin Profile', path: '/profile', icon: User, category: 'Account', desc: 'Personal details and credentials' },
    { title: 'Change Password', path: '/profile?tab=password', icon: Key, category: 'Security', desc: 'Update system password' },
    { title: 'Settings', path: '/settings', icon: Settings, category: 'System', desc: 'General, appearance, notifications & cloud services' },
    { title: 'How to Use', path: '/how-to-use', icon: BookOpen, category: 'Guides', desc: 'Step-by-step user guide and FAQs' },
    { title: 'About System', path: '/about', icon: Info, category: 'Documentation', desc: 'Architecture, MongoDB Atlas & Cloudinary stack' },
    { title: 'Help Centre', path: '/help', icon: HelpCircle, category: 'Support', desc: 'Troubleshooting and support desk' },
];

const TopBar = ({ title = 'Dashboard', subtitle = '', onMenuToggle }) => {
    const navigate = useNavigate();
    const { isGuest, clerkUser, logoutGuest } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const clerk = useClerk();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [employeeMatches, setEmployeeMatches] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    // Pre-fetch employees for instant fuzzy search
    useEffect(() => {
        let isMounted = true;
        const loadEmployees = async () => {
            try {
                const res = await employeeAPI.getAll({ limit: 100 });
                const arr = Array.isArray(res) ? res : (res?.data ?? []);
                if (isMounted) setAllEmployees(arr);
            } catch (e) {
                // Ignore silent fetch
            }
        };
        loadEmployees();
        return () => { isMounted = false; };
    }, []);

    // Filter results on search query change
    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            setEmployeeMatches([]);
            return;
        }

        const filteredEmps = allEmployees.filter(emp => 
            emp.full_name?.toLowerCase().includes(query) ||
            emp.employee_id?.toLowerCase().includes(query) ||
            emp.department?.toLowerCase().includes(query) ||
            emp.email?.toLowerCase().includes(query)
        ).slice(0, 4);

        setEmployeeMatches(filteredEmps);
    }, [searchQuery, allEmployees]);

    // Matching navigation pages
    const matchingPages = searchQuery.trim()
        ? APP_ROUTES.filter(r => 
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 4)
        : [];

    // Close dropdowns on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            navigate(`/employees?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSelectResult = (path) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(path);
    };

    const handleLogout = async () => {
        setIsDropdownOpen(false);
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

    const handleNavigate = (path) => {
        setIsDropdownOpen(false);
        navigate(path);
    };

    const userName = isGuest
        ? 'Guest User'
        : (clerkUser?.fullName || clerkUser?.firstName || 'Admin');

    const userEmail = isGuest
        ? 'guest@hrmslite.demo'
        : (clerkUser?.primaryEmailAddress?.emailAddress || 'potterharry5143@gmail.com');

    const userRole = isGuest ? 'Read-only Access' : 'Administrator';

    const avatarUrl = isGuest
        ? 'https://ui-avatars.com/api/?name=Guest+User&background=64748b&color=fff&bold=true'
        : (clerkUser?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff&bold=true`);

    const hasSearchResults = matchingPages.length > 0 || employeeMatches.length > 0;

    return (
        <div className="topbar">
            <div className="topbar-left">
                <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
                    <Menu size={24} />
                </button>
                <div className="topbar-title">
                    <h1>{title}</h1>
                    {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="topbar-right">
                {/* Global Search Bar with Live Popover */}
                <div className="topbar-search" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit}>
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search employees, pages, features..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="search-clear-btn"
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsSearchOpen(false);
                                }}
                                aria-label="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </form>

                    {/* Live Global Search Results Dropdown */}
                    {isSearchOpen && searchQuery.trim().length > 0 && (
                        <div className="search-results-dropdown">
                            {hasSearchResults ? (
                                <>
                                    {/* Pages & Actions */}
                                    {matchingPages.length > 0 && (
                                        <div className="search-section">
                                            <span className="search-section-title">Navigation & Features</span>
                                            {matchingPages.map((page) => {
                                                const Icon = page.icon;
                                                return (
                                                    <button
                                                        key={page.path}
                                                        className="search-result-item"
                                                        onClick={() => handleSelectResult(page.path)}
                                                    >
                                                        <div className="search-item-icon">
                                                            <Icon size={16} />
                                                        </div>
                                                        <div className="search-item-info">
                                                            <div className="search-item-title-row">
                                                                <span className="search-item-name">{page.title}</span>
                                                                <span className="search-item-badge">{page.category}</span>
                                                            </div>
                                                            <span className="search-item-desc">{page.desc}</span>
                                                        </div>
                                                        <ArrowRight size={14} className="search-arrow" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Employee Personnel */}
                                    {employeeMatches.length > 0 && (
                                        <div className="search-section">
                                            <span className="search-section-title">Employees in Database</span>
                                            {employeeMatches.map((emp) => (
                                                <button
                                                    key={emp.employee_id}
                                                    className="search-result-item"
                                                    onClick={() => handleSelectResult(`/employees?search=${encodeURIComponent(emp.employee_id)}`)}
                                                >
                                                    <div className="search-item-avatar">
                                                        {emp.profile_photo_url ? (
                                                            <img src={emp.profile_photo_url} alt={emp.full_name} />
                                                        ) : (
                                                            <span>{emp.full_name?.charAt(0) || 'E'}</span>
                                                        )}
                                                    </div>
                                                    <div className="search-item-info">
                                                        <div className="search-item-title-row">
                                                            <span className="search-item-name">{emp.full_name}</span>
                                                            <span className="search-emp-id">{emp.employee_id}</span>
                                                        </div>
                                                        <span className="search-item-desc">{emp.department} • {emp.email}</span>
                                                    </div>
                                                    <ArrowRight size={14} className="search-arrow" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="search-footer-hint">
                                        <span>Press <kbd>↵ Enter</kbd> to view all search results</span>
                                    </div>
                                </>
                            ) : (
                                <div className="search-empty-state">
                                    <p>No results found for "<strong>{searchQuery}</strong>"</p>
                                    <span>Try searching for an employee name, ID (e.g. EMP001), department, or page.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    className="topbar-btn theme-toggle"
                    onClick={toggleTheme}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle theme"
                >
                    {isDarkMode
                        ? <Sun size={19} className="btn-icon theme-icon" />
                        : <Moon size={19} className="btn-icon theme-icon" />
                    }
                </button>

                {/* Profile Pill with Interactive Dropdown */}
                <div className="topbar-profile-container" ref={dropdownRef}>
                    <button 
                        className={`topbar-profile ${isDropdownOpen ? 'active' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        <div className="profile-avatar">
                            <img
                                src={avatarUrl}
                                alt={userName}
                            />
                        </div>
                        <div className="profile-info">
                            <span className="profile-name">{userName}</span>
                            <span className="profile-role">{userRole}</span>
                        </div>
                        <ChevronDown 
                            size={16} 
                            className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`} 
                        />
                    </button>

                    {/* Popover Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="profile-dropdown-menu">
                            <div className="dropdown-header">
                                <div className="dropdown-avatar">
                                    <img src={avatarUrl} alt={userName} />
                                </div>
                                <div className="dropdown-user-details">
                                    <span className="dropdown-user-name">{userName}</span>
                                    <span className="dropdown-user-email">{userEmail}</span>
                                    <span className={`dropdown-role-badge ${isGuest ? 'guest' : 'admin'}`}>
                                        <Shield size={11} />
                                        {isGuest ? 'Guest User' : 'Super Administrator'}
                                    </span>
                                </div>
                            </div>

                            <div className="dropdown-divider" />

                            <div className="dropdown-items">
                                <button 
                                    className="dropdown-item"
                                    onClick={() => handleNavigate('/profile')}
                                >
                                    <div className="dropdown-item-icon profile-icon">
                                        <User size={16} />
                                    </div>
                                    <div className="dropdown-item-text">
                                        <span className="item-title">My Profile</span>
                                        <span className="item-subtitle">View personal & department info</span>
                                    </div>
                                </button>

                                <button 
                                    className="dropdown-item"
                                    onClick={() => handleNavigate('/profile?tab=password')}
                                >
                                    <div className="dropdown-item-icon password-icon">
                                        <Key size={16} />
                                    </div>
                                    <div className="dropdown-item-text">
                                        <span className="item-title">Change Password</span>
                                        <span className="item-subtitle">Manage login credentials</span>
                                    </div>
                                </button>

                                <button 
                                    className="dropdown-item"
                                    onClick={() => handleNavigate('/settings')}
                                >
                                    <div className="dropdown-item-icon settings-icon">
                                        <Settings size={16} />
                                    </div>
                                    <div className="dropdown-item-text">
                                        <span className="item-title">Settings</span>
                                        <span className="item-subtitle">System & preference controls</span>
                                    </div>
                                </button>
                            </div>

                            <div className="dropdown-divider" />

                            <div className="dropdown-footer">
                                <button 
                                    className="dropdown-logout-btn"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    <span>{isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
