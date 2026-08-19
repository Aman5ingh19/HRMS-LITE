import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
    Sliders, Sun, Moon, Database, Bell, Shield, 
    Save, CheckCircle2, Server, Cloud, Globe, Clock, 
    Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import GuestBanner from '../components/GuestBanner';
import './Settings.css';

const Settings = () => {
    const { isGuest } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    const [activeTab, setActiveTab] = useState('general');

    // General Form State
    const [companyName, setCompanyName] = useState('HRMS Lite Enterprises');
    const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
    const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');
    const [currency, setCurrency] = useState('INR (₹)');

    // Notifications State
    const [notifyCheckin, setNotifyCheckin] = useState(true);
    const [notifyNewEmp, setNotifyNewEmp] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);

    // Appearance State
    const [compactTables, setCompactTables] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        if (isGuest) {
            toast.error('Settings cannot be saved in Guest Mode (read-only)');
            return;
        }
        toast.success('Settings updated successfully!');
    };

    return (
        <div className="settings-page">
            {isGuest && (
                <GuestBanner message="You are viewing Settings in Guest Mode. Any modifications will be in preview mode only." />
            )}

            <div className="settings-header">
                <div className="settings-header-icon">
                    <Sliders size={26} />
                </div>
                <div>
                    <h2>System Settings</h2>
                    <p>Configure company preferences, application appearance, notifications, and cloud services</p>
                </div>
            </div>

            <div className="settings-layout">
                {/* Navigation Tabs */}
                <div className="settings-tabs-sidebar">
                    <button
                        className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        <Globe size={18} />
                        <span>General & Org</span>
                    </button>

                    <button
                        className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appearance')}
                    >
                        <Layers size={18} />
                        <span>Appearance</span>
                    </button>

                    <button
                        className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} />
                        <span>Notifications</span>
                    </button>

                    <button
                        className={`settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
                        onClick={() => setActiveTab('system')}
                    >
                        <Database size={18} />
                        <span>Cloud & Infrastructure</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="settings-content-card">
                    <form onSubmit={handleSave}>
                        {/* ── Tab 1: General ─────────────────────────────── */}
                        {activeTab === 'general' && (
                            <div className="settings-section">
                                <div className="settings-section-header">
                                    <h3>Organization Details</h3>
                                    <p>Basic organization setup and regional preferences</p>
                                </div>

                                <div className="settings-form-grid">
                                    <div className="settings-group">
                                        <label>Company / Organization Name</label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            disabled={isGuest}
                                            required
                                        />
                                    </div>

                                    <div className="settings-group">
                                        <label><Clock size={14} /> Timezone</label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            disabled={isGuest}
                                        >
                                            <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
                                            <option value="America/New_York (EST -5:00)">America/New_York (EST -5:00)</option>
                                            <option value="Europe/London (GMT +0:00)">Europe/London (GMT +0:00)</option>
                                            <option value="Asia/Tokyo (JST +9:00)">Asia/Tokyo (JST +9:00)</option>
                                        </select>
                                    </div>

                                    <div className="settings-group">
                                        <label>Date Display Format</label>
                                        <select
                                            value={dateFormat}
                                            onChange={(e) => setDateFormat(e.target.value)}
                                            disabled={isGuest}
                                        >
                                            <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 20-08-2026)</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-08-20)</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/20/2026)</option>
                                        </select>
                                    </div>

                                    <div className="settings-group">
                                        <label>Default Currency</label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            disabled={isGuest}
                                        >
                                            <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                                            <option value="USD ($)">USD ($) - US Dollar</option>
                                            <option value="EUR (€)">EUR (€) - Euro</option>
                                            <option value="GBP (£)">GBP (£) - British Pound</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab 2: Appearance ───────────────────────────── */}
                        {activeTab === 'appearance' && (
                            <div className="settings-section">
                                <div className="settings-section-header">
                                    <h3>Theme & Interface</h3>
                                    <p>Customize how HRMS Lite looks and feels on your screen</p>
                                </div>

                                <div className="settings-theme-cards">
                                    <div 
                                        className={`theme-picker-card ${!isDarkMode ? 'selected' : ''}`}
                                        onClick={() => { if (isDarkMode) toggleTheme(); }}
                                    >
                                        <div className="theme-preview-light">
                                            <div className="preview-topbar" />
                                            <div className="preview-sidebar" />
                                        </div>
                                        <div className="theme-card-info">
                                            <Sun size={18} />
                                            <div>
                                                <h4>Light Theme</h4>
                                                <p>Crisp, clean bright appearance</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div 
                                        className={`theme-picker-card ${isDarkMode ? 'selected' : ''}`}
                                        onClick={() => { if (!isDarkMode) toggleTheme(); }}
                                    >
                                        <div className="theme-preview-dark">
                                            <div className="preview-topbar dark" />
                                            <div className="preview-sidebar dark" />
                                        </div>
                                        <div className="theme-card-info">
                                            <Moon size={18} />
                                            <div>
                                                <h4>Dark Theme</h4>
                                                <p>Sleek, high-contrast dark mode</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-toggle-row" style={{ marginTop: '24px' }}>
                                    <div>
                                        <h4>Compact Table View</h4>
                                        <p>Reduce padding in employee & attendance lists for higher data density</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={compactTables}
                                            onChange={(e) => setCompactTables(e.target.checked)}
                                        />
                                        <span className="slider round" />
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* ── Tab 3: Notifications ────────────────────────── */}
                        {activeTab === 'notifications' && (
                            <div className="settings-section">
                                <div className="settings-section-header">
                                    <h3>Notification Alerts</h3>
                                    <p>Manage system notifications and email reminders</p>
                                </div>

                                <div className="settings-toggles-list">
                                    <div className="settings-toggle-row">
                                        <div>
                                            <h4>Daily Attendance Reminders</h4>
                                            <p>Notify admin when employees check-in or fail to mark attendance</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={notifyCheckin}
                                                onChange={(e) => setNotifyCheckin(e.target.checked)}
                                                disabled={isGuest}
                                            />
                                            <span className="slider round" />
                                        </label>
                                    </div>

                                    <div className="settings-toggle-row">
                                        <div>
                                            <h4>New Employee Onboarding Alert</h4>
                                            <p>Send an immediate confirmation toast/email when a new employee is added</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={notifyNewEmp}
                                                onChange={(e) => setNotifyNewEmp(e.target.checked)}
                                                disabled={isGuest}
                                            />
                                            <span className="slider round" />
                                        </label>
                                    </div>

                                    <div className="settings-toggle-row">
                                        <div>
                                            <h4>Weekly Attendance Digest</h4>
                                            <p>Generate automatic weekly attendance rate summaries for managers</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={weeklyReport}
                                                onChange={(e) => setWeeklyReport(e.target.checked)}
                                                disabled={isGuest}
                                            />
                                            <span className="slider round" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab 4: System & Cloud ───────────────────────── */}
                        {activeTab === 'system' && (
                            <div className="settings-section">
                                <div className="settings-section-header">
                                    <h3>Cloud Infrastructure & Services</h3>
                                    <p>Connected third-party databases, cache layers, and identity providers</p>
                                </div>

                                <div className="system-services-grid">
                                    <div className="service-card">
                                        <div className="service-header">
                                            <div className="service-icon mongodb">
                                                <Database size={20} />
                                            </div>
                                            <span className="service-status active">
                                                <CheckCircle2 size={13} /> Connected
                                            </span>
                                        </div>
                                        <h4>MongoDB Atlas</h4>
                                        <p>Cloud Cluster: <code>Cluster0.vbtvr4g.mongodb.net</code></p>
                                        <span className="service-meta">Primary Cloud Database</span>
                                    </div>

                                    <div className="service-card">
                                        <div className="service-header">
                                            <div className="service-icon django">
                                                <Server size={20} />
                                            </div>
                                            <span className="service-status active">
                                                <CheckCircle2 size={13} /> Online
                                            </span>
                                        </div>
                                        <h4>Django REST Framework</h4>
                                        <p>API Host: <code>http://127.0.0.1:8000</code></p>
                                        <span className="service-meta">Backend API Engine</span>
                                    </div>

                                    <div className="service-card">
                                        <div className="service-header">
                                            <div className="service-icon clerk">
                                                <Shield size={20} />
                                            </div>
                                            <span className="service-status active">
                                                <CheckCircle2 size={13} /> Active
                                            </span>
                                        </div>
                                        <h4>Clerk Identity Provider</h4>
                                        <p>Environment: <code>pk_test_...</code></p>
                                        <span className="service-meta">Authentication & Sessions</span>
                                    </div>

                                    <div className="service-card">
                                        <div className="service-header">
                                            <div className="service-icon cloudinary">
                                                <Cloud size={20} />
                                            </div>
                                            <span className="service-status active">
                                                <CheckCircle2 size={13} /> Configured
                                            </span>
                                        </div>
                                        <h4>Cloudinary Media</h4>
                                        <p>Folder: <code>hrms-lite/employees</code></p>
                                        <span className="service-meta">Asset & Profile Photo Storage</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="settings-footer">
                            <button type="submit" className="settings-save-btn">
                                <Save size={16} /> Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
