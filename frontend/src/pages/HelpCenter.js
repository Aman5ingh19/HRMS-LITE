import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    HelpCircle, ChevronDown, ChevronUp, MessageCircle, Book,
    Eye, AlertCircle, CheckCircle, Mail, ExternalLink, Phone,
    Bug, Lightbulb, Shield
} from 'lucide-react';
import './HelpCenter.css';

const categories = [
    {
        id: 'getting-started',
        label: 'Getting Started',
        icon: Book,
        color: '#667eea',
        faqs: [
            {
                q: 'How do I sign in?',
                a: 'If Clerk is configured, click "Sign in with Clerk" on the login page. If you only want to explore, click "Continue as Guest" for read-only access.',
            },
            {
                q: 'What is Guest Mode?',
                a: 'Guest Mode grants view-only access to all pages: Dashboard, Employees, Attendance, Help, About, and How To Use. You cannot add, edit, or delete any data as a guest.',
            },
            {
                q: 'How do I become an admin?',
                a: 'Set up a Clerk account, add your publishable key to the frontend .env file as REACT_APP_CLERK_PUBLISHABLE_KEY, and sign in via Clerk. Clerk-authenticated users are treated as admins.',
            },
        ],
    },
    {
        id: 'employees',
        label: 'Employee Management',
        icon: Shield,
        color: '#48bb78',
        faqs: [
            {
                q: 'How do I add a new employee?',
                a: 'Go to the Employees page and click the "+ Add Employee" button (visible to admins). Fill in the form and click Save.',
            },
            {
                q: 'Can I search for an employee?',
                a: 'Yes. Use the search bar at the top of the Employees page to filter by name or any other field.',
            },
            {
                q: 'How do I delete an employee?',
                a: 'Click the trash icon next to the employee in the table. You will be asked to confirm before deletion. This action is irreversible and is admin-only.',
            },
        ],
    },
    {
        id: 'attendance',
        label: 'Attendance',
        icon: CheckCircle,
        color: '#ed8936',
        faqs: [
            {
                q: 'How do I mark attendance?',
                a: 'Go to the Attendance page, choose an employee and the date, then click Present or Absent. Admin access required.',
            },
            {
                q: 'Can I view past attendance records?',
                a: 'Yes. Use the date filter on the Attendance page to browse historical records. Guests can view all records.',
            },
            {
                q: 'Why does the Dashboard attendance count seem off?',
                a: 'The Dashboard shows today\'s attendance count. If employees have not been marked yet for today, the count will reflect only those that have been marked.',
            },
        ],
    },
    {
        id: 'issues',
        label: 'Troubleshooting',
        icon: Bug,
        color: '#fc8181',
        faqs: [
            {
                q: 'The app shows no employees — what is wrong?',
                a: 'Ensure the Django backend API service is reachable and connected to MongoDB Atlas. Check your REACT_APP_API_URL in the environment configuration.',
            },
            {
                q: 'I keep getting a 401 Unauthorized error.',
                a: 'This happens when the backend expects authentication but is not receiving valid credentials. Check DRF permission classes and ensure the API allows the request type.',
            },
            {
                q: 'Dark mode is not saving between sessions.',
                a: 'HRMS Lite currently stores the theme preference in memory for the current session. Persisting to localStorage is on the roadmap.',
            },
        ],
    },
];

const tips = [
    { icon: Lightbulb, text: 'Use the date filter on Attendance to quickly spot gaps in records.', color: '#ed8936' },
    { icon: Eye, text: 'Share a Guest Mode link with stakeholders — they can explore without touching data.', color: '#9f7aea' },
    { icon: CheckCircle, text: 'The Dashboard calendar updates in real-time as attendance is marked.', color: '#48bb78' },
];

export default function HelpCenter() {
    const { isGuest } = useAuth();
    const [openItem, setOpenItem] = useState(null);
    const [activeCategory, setActiveCategory] = useState('getting-started');

    const currentCategory = categories.find(c => c.id === activeCategory);

    return (
        <div className="help-page">
            {/* Hero */}
            <div className="help-hero">
                <div className="help-hero-icon">
                    <HelpCircle size={36} />
                </div>
                <div className="help-hero-text">
                    <h1 className="help-title">Help Centre</h1>
                    <p className="help-subtitle">Find answers to common questions and get the most out of HRMS Lite.</p>
                </div>
                {isGuest && (
                    <div className="help-guest-badge">
                        <Eye size={14} />
                        Guest Mode — View Only
                    </div>
                )}
            </div>

            {/* Guest callout */}
            {isGuest && (
                <div className="help-guest-callout">
                    <Shield size={18} />
                    <span><strong>Guest Mode active.</strong> All help content is fully accessible. No actions are restricted on this page.</span>
                </div>
            )}

            {/* Tips */}
            <div className="help-tips-row">
                {tips.map((tip, i) => {
                    const Icon = tip.icon;
                    return (
                        <div key={i} className="help-tip-chip" style={{ borderColor: tip.color + '44', background: tip.color + '0d' }}>
                            <Icon size={15} style={{ color: tip.color, flexShrink: 0 }} />
                            <span>{tip.text}</span>
                        </div>
                    );
                })}
            </div>

            {/* Category tabs + FAQ */}
            <div className="help-main">
                <div className="help-sidebar">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                className={'help-cat-btn' + (activeCategory === cat.id ? ' active' : '')}
                                style={activeCategory === cat.id ? { borderColor: cat.color, color: cat.color, background: cat.color + '14' } : {}}
                                onClick={() => { setActiveCategory(cat.id); setOpenItem(null); }}
                            >
                                <Icon size={16} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                <div className="help-faq-panel">
                    <h2 className="help-cat-title" style={{ color: currentCategory.color }}>
                        {currentCategory.label}
                    </h2>
                    {currentCategory.faqs.map((faq, i) => (
                        <div key={i} className={'help-faq-item' + (openItem === i ? ' open' : '')}>
                            <button
                                className="help-faq-q"
                                onClick={() => setOpenItem(openItem === i ? null : i)}
                            >
                                <HelpCircle size={15} style={{ color: currentCategory.color, flexShrink: 0 }} />
                                <span>{faq.q}</span>
                                {openItem === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                            {openItem === i && (
                                <div className="help-faq-a">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <div className="help-contact-section">
                <h2 className="help-section-title">Still need help?</h2>
                <div className="help-contact-grid">
                    <div className="help-contact-card">
                        <Mail size={22} className="help-contact-icon" style={{ color: '#667eea' }} />
                        <div>
                            <h3>Email Support</h3>
                            <p>Reach out and we'll get back to you within 24 hours.</p>
                            <a href="mailto:support@hrms-lite.com" className="help-contact-link">
                                support@hrms-lite.com <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                    <div className="help-contact-card">
                        <Book size={22} className="help-contact-icon" style={{ color: '#48bb78' }} />
                        <div>
                            <h3>Documentation</h3>
                            <p>Read the full user guide and developer docs.</p>
                            <a href="/how-to-use" className="help-contact-link">
                                How To Use guide <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                    <div className="help-contact-card">
                        <MessageCircle size={22} className="help-contact-icon" style={{ color: '#ed8936' }} />
                        <div>
                            <h3>Community</h3>
                            <p>Ask questions and share tips with other users.</p>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="help-contact-link">
                                GitHub Discussions <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
