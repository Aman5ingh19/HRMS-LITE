import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen, LayoutDashboard, Users, CheckSquare, HelpCircle,
    ChevronDown, ChevronUp, Lock, Eye, Edit3, UserPlus, UserMinus,
    Search, Filter, Download, Bell, Moon, LogOut, Shield
} from 'lucide-react';
import './HowToUse.css';

const steps = [
    {
        id: 1,
        icon: LayoutDashboard,
        title: 'Dashboard Overview',
        color: '#667eea',
        description: 'The Dashboard is your command centre. At a glance you can see:',
        points: [
            'Total employee count across the organisation',
            'Present / absent count for today',
            'Overall attendance rate as a percentage',
            'A live attendance calendar for the current month',
            'A quick-view employee directory',
        ],
        tip: 'Use the calendar arrows to browse previous months and spot attendance trends.',
    },
    {
        id: 2,
        icon: Users,
        title: 'Managing Employees',
        color: '#48bb78',
        description: 'The Employees page lets you manage your full workforce:',
        points: [
            'View the complete employee list with search & filter',
            'Add a new employee using the "+ Add Employee" button (admin only)',
            'Edit an existing employee record by clicking the pencil icon (admin only)',
            'Delete an employee by clicking the trash icon (admin only)',
            'Use pagination to navigate large employee sets',
        ],
        tip: 'Guest users can browse and search employees but cannot add, edit, or delete records.',
    },
    {
        id: 3,
        icon: CheckSquare,
        title: 'Tracking Attendance',
        color: '#ed8936',
        description: 'The Attendance page provides a detailed attendance log:',
        points: [
            'Browse all attendance records with date filters',
            'Mark an employee Present or Absent for the day (admin only)',
            'Filter records by a specific date using the date picker',
            'Paginate through large attendance histories',
        ],
        tip: 'Guest users can view all attendance records but cannot mark or modify attendance.',
    },
    {
        id: 4,
        icon: Bell,
        title: 'Notifications & Toasts',
        color: '#9f7aea',
        description: 'HRMS Lite uses toast notifications to keep you informed:',
        points: [
            'Green toasts confirm successful actions (add, edit, delete)',
            'Red toasts alert you to errors or failed operations',
            'Toasts auto-dismiss after 3 seconds',
        ],
        tip: 'If you see an error toast, check the browser console for more detail.',
    },
    {
        id: 5,
        icon: Moon,
        title: 'Dark Mode',
        color: '#4299e1',
        description: 'Toggle between light and dark theme using the moon/sun icon in the top bar:',
        points: [
            'Click the icon in the top-right area of the TopBar',
            'The theme is preserved within your session',
            'All pages respect the theme',
        ],
        tip: 'Dark mode is easier on the eyes during long working sessions.',
    },
    {
        id: 6,
        icon: LogOut,
        title: 'Logging Out',
        color: '#fc8181',
        description: 'To end your session securely:',
        points: [
            'Click the "Logout" button at the bottom of the sidebar',
            'For guest sessions this simply clears your session storage',
            'For Clerk-authenticated sessions this signs you out of Clerk',
        ],
        tip: 'Always log out when using a shared or public computer.',
    },
];

const faqs = [
    {
        q: 'What is Guest Mode?',
        a: 'Guest Mode lets anyone explore HRMS Lite without signing in. You can view the Dashboard, Employees, and Attendance data, but all edit / add / delete actions are disabled. It is perfect for demos or evaluations.',
    },
    {
        q: 'How do I become an admin?',
        a: 'Configure your Clerk publishable key in the .env file and sign in via Clerk. Authenticated Clerk users get full admin access.',
    },
    {
        q: 'Can I export data?',
        a: 'Export functionality is on the roadmap. For now, you can copy data from the tables.',
    },
    {
        q: 'Is my data safe?',
        a: 'All data is stored in your own Django backend. No data is sent to third-party services beyond Clerk authentication.',
    },
    {
        q: 'What browsers are supported?',
        a: 'HRMS Lite works best in modern Chromium-based browsers (Chrome, Edge, Brave) and Firefox. Safari is also supported.',
    },
];

export default function HowToUse() {
    const { isGuest } = useAuth();
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="howto-page">
            {/* Hero */}
            <div className="howto-hero">
                <div className="howto-hero-icon">
                    <BookOpen size={36} />
                </div>
                <div className="howto-hero-text">
                    <h1 className="howto-title">How to Use HRMS Lite</h1>
                    <p className="howto-subtitle">
                        A step-by-step guide to every feature — from Dashboard to Attendance.
                    </p>
                </div>
                {isGuest && (
                    <div className="howto-guest-badge">
                        <Eye size={14} />
                        Guest Mode — View Only
                    </div>
                )}
            </div>

            {/* Guest mode callout */}
            {isGuest && (
                <div className="howto-guest-callout">
                    <Shield size={20} className="howto-callout-icon" />
                    <div>
                        <strong>You are browsing in Guest Mode.</strong>
                        <span> You can read all sections freely. Actions that modify data (add, edit, delete, mark attendance) are locked and require admin sign-in.</span>
                    </div>
                </div>
            )}

            {/* Steps */}
            <div className="howto-steps-grid">
                {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                        <div key={step.id} className="howto-card">
                            <div className="howto-card-header">
                                <div className="howto-step-icon" style={{ background: step.color + '22', color: step.color }}>
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <span className="howto-step-num">Step {step.id}</span>
                                    <h2 className="howto-step-title">{step.title}</h2>
                                </div>
                            </div>
                            <p className="howto-card-desc">{step.description}</p>
                            <ul className="howto-points">
                                {step.points.map((pt, i) => (
                                    <li key={i} className="howto-point">
                                        <span className="howto-dot" style={{ background: step.color }} />
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                            <div className="howto-tip" style={{ borderColor: step.color + '44', background: step.color + '11' }}>
                                <span className="howto-tip-label" style={{ color: step.color }}>&#128161; Tip</span>
                                <span>{step.tip}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Guest vs Admin table */}
            <div className="howto-section">
                <h2 className="howto-section-title">Guest vs Admin Capabilities</h2>
                <div className="howto-table-wrapper">
                    <table className="howto-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Guest</th>
                                <th>Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['View Dashboard', true, true],
                                ['View Employees', true, true],
                                ['Add / Edit / Delete Employees', false, true],
                                ['View Attendance', true, true],
                                ['Mark Attendance', false, true],
                                ['Dark Mode Toggle', true, true],
                                ['Help Centre', true, true],
                                ['About Page', true, true],
                                ['How to Use Page', true, true],
                            ].map(([feat, guest, admin]) => (
                                <tr key={feat}>
                                    <td>{feat}</td>
                                    <td className={guest ? 'cell-yes' : 'cell-no'}>{guest ? '✓' : '✗'}</td>
                                    <td className={admin ? 'cell-yes' : 'cell-no'}>{admin ? '✓' : '✗'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQ */}
            <div className="howto-section">
                <h2 className="howto-section-title">Frequently Asked Questions</h2>
                <div className="howto-faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className={'howto-faq-item' + (openFaq === i ? ' open' : '')}>
                            <button
                                className="howto-faq-q"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <HelpCircle size={16} className="faq-icon" />
                                <span>{faq.q}</span>
                                {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {openFaq === i && (
                                <div className="howto-faq-a">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
