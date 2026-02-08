import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './TopBar.css';

const TopBar = ({ title = 'Dashboard', subtitle = '' }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/employees?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="topbar-title">
                    <h1>{title}</h1>
                    {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="topbar-right">
                <div className="topbar-search">
                    <form onSubmit={handleSearch}>
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </form>
                </div>

                <div className="topbar-profile">
                    <div className="profile-avatar">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin&background=667eea&color=fff&bold=true"
                            alt="Admin"
                        />
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">Admin</span>
                        <span className="profile-role">Administrator</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
