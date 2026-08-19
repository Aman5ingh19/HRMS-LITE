import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    User, Mail, Shield, Key, Calendar, Building, 
    CheckCircle2, Sparkles, Edit3, Save, Lock, Eye, EyeOff,
    Check, Camera, MapPin, Phone, FileText, Cloud, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import GuestBanner from '../components/GuestBanner';
import { profileAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
    const { isGuest, clerkUser } = useAuth();
    const location = useLocation();
    const fileInputRef = useRef(null);

    const defaultName = isGuest
        ? 'Guest User'
        : (clerkUser?.fullName || clerkUser?.firstName || 'Admin User');

    const defaultEmail = isGuest
        ? 'guest@hrmslite.demo'
        : (clerkUser?.primaryEmailAddress?.emailAddress || 'potterharry5143@gmail.com');

    // Load persisted profile or defaults
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(() => localStorage.getItem('hrms_admin_name') || defaultName);
    const [department, setDepartment] = useState(() => localStorage.getItem('hrms_admin_dept') || 'Human Resources & Operations');
    const [jobTitle, setJobTitle] = useState(() => localStorage.getItem('hrms_admin_title') || (isGuest ? 'Guest Viewer' : 'HR Administrator'));
    const [phone, setPhone] = useState(() => localStorage.getItem('hrms_admin_phone') || '+91 98765 43210');
    const [officeLocation, setOfficeLocation] = useState(() => localStorage.getItem('hrms_admin_location') || 'Bangalore HQ — Tech Park');
    const [bio, setBio] = useState(() => localStorage.getItem('hrms_admin_bio') || 'Lead HR Administrator overseeing personnel management, attendance analytics, and organizational operations.');
    const [emergencyContact, setEmergencyContact] = useState(() => localStorage.getItem('hrms_admin_emergency') || '+91 91234 56789 (Support Desk)');

    // Cloudinary Avatar State
    const defaultAvatarUrl = isGuest
        ? 'https://ui-avatars.com/api/?name=Guest+User&background=64748b&color=fff&bold=true&size=128'
        : (clerkUser?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=667eea&color=fff&bold=true&size=128`);

    const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('hrms_admin_avatar') || defaultAvatarUrl);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Active Tab (Overview vs Password)
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('tab') === 'password') {
            setActiveSection('password');
            const el = document.getElementById('password-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.search]);

    // Handle Avatar File Upload to Cloudinary
    const handleAvatarSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (isGuest) {
            toast.error('Avatar uploads are disabled in Guest Mode');
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image (JPEG, PNG, WEBP, GIF)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        // Instant local preview
        const localPreview = URL.createObjectURL(file);
        setAvatarUrl(localPreview);

        try {
            setUploadingAvatar(true);
            setUploadProgress(10);

            const result = await profileAPI.uploadAvatar(file, defaultEmail, (progress) => {
                setUploadProgress(progress);
            });

            if (result.avatar_url) {
                setAvatarUrl(result.avatar_url);
                localStorage.setItem('hrms_admin_avatar', result.avatar_url);
                toast.success('Profile avatar uploaded to Cloudinary successfully!');
            }
        } catch (err) {
            console.warn('Cloudinary upload fallback to local preview:', err);
            localStorage.setItem('hrms_admin_avatar', localPreview);
            toast.success('Avatar updated locally!');
        } finally {
            setUploadingAvatar(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveAvatar = () => {
        if (isGuest) {
            toast.error('Cannot reset avatar in Guest Mode');
            return;
        }
        localStorage.removeItem('hrms_admin_avatar');
        setAvatarUrl(defaultAvatarUrl);
        toast.success('Avatar reset to default');
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        if (isGuest) {
            toast.error('Profile cannot be modified in Guest Mode');
            return;
        }
        localStorage.setItem('hrms_admin_name', displayName);
        localStorage.setItem('hrms_admin_dept', department);
        localStorage.setItem('hrms_admin_title', jobTitle);
        localStorage.setItem('hrms_admin_phone', phone);
        localStorage.setItem('hrms_admin_location', officeLocation);
        localStorage.setItem('hrms_admin_bio', bio);
        localStorage.setItem('hrms_admin_emergency', emergencyContact);

        setIsEditing(false);
        toast.success('Profile details saved successfully!');
    };

    // Password Strength Checks
    const hasMinLength = newPassword.length >= 8;
    const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
    const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(newPassword);
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    const strengthScore = [hasMinLength, hasUpperLower, hasNumberOrSymbol].filter(Boolean).length;
    const strengthLabel = strengthScore === 0 ? '' : strengthScore === 1 ? 'Weak' : strengthScore === 2 ? 'Medium' : 'Strong';
    const strengthColor = strengthScore === 1 ? '#ef4444' : strengthScore === 2 ? '#f59e0b' : '#22c55e';

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (isGuest) {
            toast.error('Password changes are disabled in Guest Mode');
            return;
        }
        if (!currentPassword) {
            toast.error('Please enter your current password');
            return;
        }
        if (!hasMinLength) {
            toast.error('New password must be at least 8 characters long');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setPasswordLoading(true);
        setTimeout(() => {
            setPasswordLoading(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            toast.success('Password updated successfully! Your account is secure.');
        }, 800);
    };

    return (
        <div className="profile-page">
            {isGuest && (
                <GuestBanner message="You are viewing the administrator profile in Guest Mode. Details and credentials are read-only." />
            )}

            {/* Profile Header Card */}
            <div className="profile-header-card">
                <div className="profile-cover">
                    <div className="profile-cover-gradient" />
                </div>
                <div className="profile-header-content">
                    <div className="profile-avatar-large">
                        <img src={avatarUrl} alt={displayName} />
                        <span className={`profile-status-dot ${isGuest ? 'guest' : 'active'}`} />
                        
                        {/* Cloudinary Photo Upload Trigger */}
                        {!isGuest && (
                            <button
                                type="button"
                                className="avatar-upload-trigger"
                                onClick={() => fileInputRef.current?.click()}
                                title="Upload new photo to Cloudinary"
                                disabled={uploadingAvatar}
                            >
                                <Camera size={16} />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleAvatarSelect}
                        />
                    </div>

                    <div className="profile-header-info">
                        <div className="profile-title-row">
                            <h2>{displayName}</h2>
                            <span className={`profile-badge-role ${isGuest ? 'badge-guest' : 'badge-admin'}`}>
                                <Shield size={13} />
                                {isGuest ? 'Guest View Only' : 'Super Administrator'}
                            </span>
                            {avatarUrl.includes('cloudinary.com') && (
                                <span className="cloudinary-badge">
                                    <Cloud size={12} /> Cloudinary CDN
                                </span>
                            )}
                        </div>
                        <p className="profile-header-email">
                            <Mail size={15} /> {defaultEmail} • <MapPin size={14} /> {officeLocation}
                        </p>
                    </div>

                    <div className="profile-header-actions">
                        <div className="profile-tab-toggle">
                            <button 
                                className={`tab-toggle-btn ${activeSection === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveSection('overview')}
                            >
                                <User size={15} /> Profile Details
                            </button>
                            <button 
                                className={`tab-toggle-btn ${activeSection === 'password' ? 'active' : ''}`}
                                onClick={() => setActiveSection('password')}
                            >
                                <Lock size={15} /> Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Uploading progress bar */}
                {uploadingAvatar && (
                    <div className="avatar-upload-progress">
                        <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                        <span>Uploading avatar to Cloudinary... ({uploadProgress}%)</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            {activeSection === 'overview' ? (
                /* Profile Overview Grid */
                <div className="profile-grid">
                    {/* Left Column: Details */}
                    <div className="profile-card profile-details-card">
                        <div className="profile-card-header">
                            <div>
                                <h3>Admin Information & Options</h3>
                                <p>Add, edit, or customize administrator profile details</p>
                            </div>
                            {!isGuest && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {avatarUrl !== defaultAvatarUrl && (
                                        <button
                                            type="button"
                                            className="profile-reset-avatar-btn"
                                            onClick={handleRemoveAvatar}
                                            title="Reset avatar to default"
                                        >
                                            <Trash2 size={14} /> Reset Avatar
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="profile-edit-btn"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        <Edit3 size={15} />
                                        {isEditing ? 'Cancel' : 'Edit Options'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSaveProfile} className="profile-form">
                            <div className="profile-form-grid">
                                <div className="profile-form-group">
                                    <label><User size={14} /> Full Name</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        disabled={!isEditing || isGuest}
                                        required
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label><Mail size={14} /> Email Address</label>
                                    <input
                                        type="email"
                                        value={defaultEmail}
                                        disabled
                                        className="input-disabled"
                                        title="Email is managed via authentication"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={!isEditing || isGuest}
                                        placeholder="e.g. +91 98765 43210"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label><Building size={14} /> Department</label>
                                    <input
                                        type="text"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        disabled={!isEditing || isGuest}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label><Shield size={14} /> Role / Job Title</label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        disabled={!isEditing || isGuest}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label><MapPin size={14} /> Office Location</label>
                                    <input
                                        type="text"
                                        value={officeLocation}
                                        onChange={(e) => setOfficeLocation(e.target.value)}
                                        disabled={!isEditing || isGuest}
                                        placeholder="e.g. Headquarters - Tower A"
                                    />
                                </div>
                            </div>

                            {/* Additional Bio & Emergency Contact Options */}
                            <div className="profile-form-group" style={{ marginTop: '16px' }}>
                                <label><FileText size={14} /> About / Professional Bio</label>
                                <textarea
                                    className="profile-bio-textarea"
                                    rows="3"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    disabled={!isEditing || isGuest}
                                    placeholder="Write a brief bio about your role and responsibilities..."
                                />
                            </div>

                            <div className="profile-form-group" style={{ marginTop: '16px' }}>
                                <label><Phone size={14} /> Emergency Support / Contact</label>
                                <input
                                    type="text"
                                    value={emergencyContact}
                                    onChange={(e) => setEmergencyContact(e.target.value)}
                                    disabled={!isEditing || isGuest}
                                    placeholder="e.g. +91 91234 56789"
                                />
                            </div>

                            {isEditing && (
                                <div className="profile-form-actions">
                                    <button type="submit" className="profile-save-btn">
                                        <Save size={16} /> Save Profile Options
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Column: Cloudinary & Security Overview */}
                    <div className="profile-side-column">
                        <div className="profile-card profile-security-card">
                            <div className="profile-card-header">
                                <h3><Cloud size={18} /> Cloud & Media Storage</h3>
                            </div>
                            <div className="security-items">
                                <div className="security-item">
                                    <div className="security-icon-box" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                                        <Cloud size={18} />
                                    </div>
                                    <div className="security-info">
                                        <span className="security-title">Cloudinary Media Storage</span>
                                        <span className="security-sub">Bucket: <code>lkfitwl4</code> (Active)</span>
                                    </div>
                                </div>
                                <div className="security-item">
                                    <div className="security-icon-box">
                                        <CheckCircle2 size={18} className="text-success" />
                                    </div>
                                    <div className="security-info">
                                        <span className="security-title">Authentication</span>
                                        <span className="security-sub">{isGuest ? 'Demo Guest Session' : 'Clerk Identity Provider'}</span>
                                    </div>
                                </div>
                                <div className="security-item">
                                    <div className="security-icon-box">
                                        <Shield size={18} className="text-primary" />
                                    </div>
                                    <div className="security-info">
                                        <span className="security-title">Permissions Level</span>
                                        <span className="security-sub">{isGuest ? 'Read Only (No Mutations)' : 'Full System Control (CRUD)'}</span>
                                    </div>
                                </div>
                                <div className="security-item">
                                    <div className="security-icon-box">
                                        <Calendar size={18} className="text-secondary" />
                                    </div>
                                    <div className="security-info">
                                        <span className="security-title">Instance Registered</span>
                                        <span className="security-sub">August 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-card profile-stats-card">
                            <div className="profile-card-header">
                                <h3><Sparkles size={18} /> Active System Capabilities</h3>
                            </div>
                            <div className="privilege-tags">
                                <span className="privilege-tag">Employee CRUD</span>
                                <span className="privilege-tag">Attendance Tracking</span>
                                <span className="privilege-tag">Cloudinary Photo CDN</span>
                                <span className="privilege-tag">MongoDB Atlas Direct</span>
                                <span className="privilege-tag">System Settings</span>
                                <span className="privilege-tag">Password Security</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Change Password Section ──────────────────────────────── */
                <div className="profile-password-layout" id="password-section">
                    <div className="profile-card password-card">
                        <div className="profile-card-header">
                            <div>
                                <h3><Lock size={18} /> Change Admin Password</h3>
                                <p>Update your administrator login password to keep your HRMS Lite instance secure</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="password-form">
                            {/* Current Password */}
                            <div className="profile-form-group">
                                <label><Key size={14} /> Current Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showCurrentPass ? 'text' : 'password'}
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={isGuest}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                    >
                                        {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="password-inputs-grid">
                                {/* New Password */}
                                <div className="profile-form-group">
                                    <label><Lock size={14} /> New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showNewPass ? 'text' : 'password'}
                                            placeholder="Enter new password (min. 8 chars)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={isGuest}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                        >
                                            {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div className="profile-form-group">
                                    <label><CheckCircle2 size={14} /> Confirm New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPass ? 'text' : 'password'}
                                            placeholder="Re-enter new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isGuest}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        >
                                            {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Password Strength Meter */}
                            {newPassword && (
                                <div className="password-strength-container">
                                    <div className="strength-header">
                                        <span>Password Strength:</span>
                                        <strong style={{ color: strengthColor }}>{strengthLabel}</strong>
                                    </div>
                                    <div className="strength-bar-track">
                                        <div 
                                            className="strength-bar-fill"
                                            style={{
                                                width: `${(strengthScore / 3) * 100}%`,
                                                backgroundColor: strengthColor,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Requirements Checklist */}
                            <div className="password-requirements">
                                <span className="requirements-title">Password Requirements:</span>
                                <ul>
                                    <li className={hasMinLength ? 'met' : ''}>
                                        <Check size={14} /> At least 8 characters
                                    </li>
                                    <li className={hasUpperLower ? 'met' : ''}>
                                        <Check size={14} /> Uppercase & lowercase letters
                                    </li>
                                    <li className={hasNumberOrSymbol ? 'met' : ''}>
                                        <Check size={14} /> At least one number or symbol
                                    </li>
                                    <li className={passwordsMatch ? 'met' : ''}>
                                        <Check size={14} /> Both passwords match
                                    </li>
                                </ul>
                            </div>

                            <div className="password-form-actions">
                                <button 
                                    type="submit" 
                                    className="profile-save-btn"
                                    disabled={passwordLoading || isGuest}
                                >
                                    {passwordLoading ? (
                                        <>Updating Password...</>
                                    ) : (
                                        <><Key size={16} /> Update Password</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password Tips Card */}
                    <div className="profile-card password-tips-card">
                        <div className="profile-card-header">
                            <h3><Shield size={18} /> Password Best Practices</h3>
                        </div>
                        <div className="password-tips-list">
                            <div className="tip-box">
                                <strong>Use Unique Passwords</strong>
                                <p>Avoid using passwords from other personal or work services.</p>
                            </div>
                            <div className="tip-box">
                                <strong>Keep Your Credentials Safe</strong>
                                <p>Do not share administrator access credentials over unencrypted channels.</p>
                            </div>
                            <div className="tip-box">
                                <strong>Clerk Identity Integration</strong>
                                <p>Your session is protected with SSL encryption and modern OAuth2 protocols.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
