import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Building2, Users, CheckSquare, Eye,
    Shield, Code2, Heart, Mail, Github, Linkedin,
    Zap, RefreshCw, LayoutDashboard, Cloud, Database
} from 'lucide-react';
import './About.css';

const features = [
    {
        icon: LayoutDashboard,
        title: 'Live Dashboard',
        desc: 'Real-time stats, attendance rate, calendar view and employee snapshot all live from MongoDB Atlas.',
        color: '#667eea',
    },
    {
        icon: Users,
        title: 'Employee Management',
        desc: 'Add, edit, search and delete employees with full pagination and Cloudinary photo CDN.',
        color: '#48bb78',
    },
    {
        icon: CheckSquare,
        title: 'Attendance Tracking',
        desc: 'Mark daily attendance, filter by date, and review historical records with automated duration calculation.',
        color: '#ed8936',
    },
    {
        icon: Eye,
        title: 'Guest Mode',
        desc: 'Read-only access for stakeholders to explore the system without any risk of accidental edits.',
        color: '#9f7aea',
    },
    {
        icon: Shield,
        title: 'Clerk Auth',
        desc: 'Secure sign-in via Clerk. Admins get full CRUD; guests get a curated read-only view.',
        color: '#4299e1',
    },
    {
        icon: RefreshCw,
        title: 'Dark / Light Mode',
        desc: 'Toggle themes instantly. The preference persists across your entire session with native input synchronization.',
        color: '#fc8181',
    },
];

const techStack = [
    { label: 'React 18', category: 'Frontend' },
    { label: 'React Router v6', category: 'Frontend' },
    { label: 'Lucide Icons', category: 'Frontend' },
    { label: 'React Hot Toast', category: 'Frontend' },
    { label: 'Clerk Identity', category: 'Auth' },
    { label: 'Django 4', category: 'Backend' },
    { label: 'Django REST Framework', category: 'Backend' },
    { label: 'MongoDB Atlas', category: 'Database' },
    { label: 'Cloudinary CDN', category: 'Media' },
    { label: 'Redis Cache', category: 'Performance' },
    { label: 'Vanilla CSS', category: 'Styles' },
];

export default function About() {
    const { isGuest } = useAuth();

    return (
        <div className="about-page">

            {/* Hero Banner */}
            <div className="about-hero">
                <div className="about-hero-bg" />
                <div className="about-hero-content">
                    <div className="about-logo">
                        <Building2 size={42} />
                    </div>
                    <h1 className="about-hero-title">HRMS Lite</h1>
                    <p className="about-hero-tagline">Human Resource Management — simplified, modern, cloud-native, and production ready.</p>
                    {isGuest && (
                        <div className="about-guest-badge">
                            <Eye size={13} />
                            Guest Mode — View Only
                        </div>
                    )}
                </div>
            </div>

            {/* About Summary */}
            <div className="about-card about-summary">
                <h2 className="about-section-title">What is HRMS Lite?</h2>
                <p className="about-text">
                    HRMS Lite is a production-grade, full-stack Human Resource Management System built for modern teams.
                    It provides a clean, intuitive interface to manage employee rosters and track daily attendance — all backed by a
                    high-performance Django REST API, MongoDB Atlas cloud database, and Cloudinary media delivery network.
                </p>
                <p className="about-text">
                    Designed with both <strong>administrators</strong> (full management control) and <strong>guests</strong> (read-only live exploration)
                    in mind, HRMS Lite delivers an enterprise experience with zero unnecessary complexity.
                </p>
            </div>

            {/* Features Grid */}
            <div className="about-section">
                <h2 className="about-section-title">Key Features</h2>
                <div className="about-features-grid">
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div key={f.title} className="about-feature-card">
                                <div className="about-feat-icon" style={{ background: f.color + '18', color: f.color }}>
                                    <Icon size={22} />
                                </div>
                                <h3 className="about-feat-title">{f.title}</h3>
                                <p className="about-feat-desc">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="about-section">
                <h2 className="about-section-title">Tech Stack</h2>
                <div className="about-tech-list">
                    {techStack.map((t) => (
                        <div key={t.label} className="about-tech-chip">
                            <span className="about-tech-category">{t.category}</span>
                            <span className="about-tech-label">{t.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Architecture */}
            <div className="about-section">
                <h2 className="about-section-title">Architecture Overview</h2>
                <div className="about-arch-grid">
                    <div className="about-arch-block arch-frontend">
                        <Code2 size={20} />
                        <strong>Frontend (SPA)</strong>
                        <p>Production React SPA client communicating with the cloud backend via Axios, handling responsive UI, auth state, and theme controls.</p>
                    </div>
                    <div className="about-arch-arrow">&#8594;</div>
                    <div className="about-arch-block arch-backend">
                        <Zap size={20} />
                        <strong>Backend (API)</strong>
                        <p>Django REST Framework API with Pydantic validation, Redis caching, rate limiting, and RESTful endpoints.</p>
                    </div>
                    <div className="about-arch-arrow">&#8594;</div>
                    <div className="about-arch-block arch-db">
                        <Database size={20} />
                        <strong>Cloud Database</strong>
                        <p>MongoDB Atlas NoSQL cloud cluster storing scalable employee records and attendance history with high availability.</p>
                    </div>
                </div>
            </div>

            {/* Cloud Services */}
            <div className="about-section">
                <h2 className="about-section-title">Cloud Infrastructure</h2>
                <div className="about-features-grid">
                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                            <Database size={22} />
                        </div>
                        <h3 className="about-feat-title">MongoDB Atlas</h3>
                        <p className="about-feat-desc">Fully-managed cloud NoSQL cluster for personnel records and attendance logs with automated backups.</p>
                    </div>
                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
                            <Cloud size={22} />
                        </div>
                        <h3 className="about-feat-title">Cloudinary Media CDN</h3>
                        <p className="about-feat-desc">Global image processing and CDN delivering employee avatars and photos with smart face-centering crop.</p>
                    </div>
                    <div className="about-feature-card">
                        <div className="about-feat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                            <Shield size={22} />
                        </div>
                        <h3 className="about-feat-title">Clerk Identity</h3>
                        <p className="about-feat-desc">Enterprise-grade authentication, multi-factor security, and role-based session tokens.</p>
                    </div>
                </div>
            </div>

            {/* Developer */}
            <div className="about-section">
                <h2 className="about-section-title">Developer</h2>
                <div className="about-dev-card">
                    <div className="about-dev-avatar">
                        <span>AS</span>
                    </div>
                    <div className="about-dev-info">
                        <h3 className="about-dev-name">Aman Singh</h3>
                        <p className="about-dev-bio">
                            Full-stack developer passionate about clean code, modern UIs, and developer experience.
                            HRMS Lite was built as a practical, production-ready system for modern HR operations.
                        </p>
                        <div className="about-dev-links">
                            <a href="mailto:aman@example.com" className="about-dev-link">
                                <Mail size={15} /> Email
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="about-dev-link">
                                <Github size={15} /> GitHub
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="about-dev-link">
                                <Linkedin size={15} /> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer note */}
            <div className="about-footer-note">
                <Heart size={14} className="about-heart" />
                <span>Built with love · HRMS Lite · {new Date().getFullYear()}</span>
            </div>
        </div>
    );
}
