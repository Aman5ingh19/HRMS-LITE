import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LoginPage from './pages/LoginPage';
import './App.css';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Employees  = lazy(() => import('./pages/Employees'));
const Attendance = lazy(() => import('./pages/Attendance'));
const HowToUse   = lazy(() => import('./pages/HowToUse'));
const About      = lazy(() => import('./pages/About'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Settings   = lazy(() => import('./pages/Settings'));
const Profile    = lazy(() => import('./pages/Profile'));

// ── Loading skeleton ──────────────────────────────────────────────────────────
function PageSkeleton() {
    return (
        <div className="p-6 space-y-4 animate-pulse">
            <div className="h-8 bg-white/5 rounded-xl w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
            </div>
            <div className="h-64 bg-white/5 rounded-xl" />
        </div>
    );
}

// ── Protected route wrapper ───────────────────────────────────────────────────
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

// ── Main app layout (shown when authenticated) ────────────────────────────────
function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const location = useLocation();

    const getPageMeta = (pathname) => {
        switch (pathname) {
            case '/':
                return { title: 'Dashboard', subtitle: "Welcome back! Here's what's happening today" };
            case '/employees':
                return { title: 'Employee Directory', subtitle: 'Manage staff records and company personnel' };
            case '/attendance':
                return { title: 'Attendance Management', subtitle: 'Mark attendance and view daily records' };
            case '/how-to-use':
                return { title: 'How to Use HRMS Lite', subtitle: 'Step-by-step guidance and common questions' };
            case '/about':
                return { title: 'About HRMS Lite', subtitle: 'System overview, architecture, and technology stack' };
            case '/help':
                return { title: 'Help & Support Centre', subtitle: 'Troubleshooting guides, FAQs, and assistance' };
            case '/settings':
                return { title: 'System Settings', subtitle: 'Organization preferences, appearance, and cloud services' };
            case '/profile':
                return { title: 'My Profile', subtitle: 'Personal credentials, access level, and security permissions' };
            default:
                return { title: 'HRMS Lite', subtitle: '' };
        }
    };

    const meta = getPageMeta(location.pathname);

    return (
        <div className="App">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            <div className={`main-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <TopBar title={meta.title} subtitle={meta.subtitle} onMenuToggle={toggleSidebar} />
                <div className="main-content">
                    <Suspense fallback={<PageSkeleton />}>
                        <Routes>
                            {/* ── Core pages (view-only for guests, full-control for admins) ── */}
                            <Route path="/"           element={<Dashboard />} />
                            <Route path="/employees"  element={<Employees />} />
                            <Route path="/attendance" element={<Attendance />} />

                            {/* ── Info & System pages (accessible to everyone including guests) ── */}
                            <Route path="/how-to-use" element={<HowToUse />} />
                            <Route path="/about"      element={<About />} />
                            <Route path="/help"       element={<HelpCenter />} />
                            <Route path="/settings"   element={<Settings />} />
                            <Route path="/profile"    element={<Profile />} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

// ── Inner app — has access to Clerk's useUser ─────────────────────────────────
function InnerApp() {
    const { user: clerkUser } = useUser();

    return (
        <AuthProvider clerkUser={clerkUser}>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: 'rgba(30, 41, 59, 0.95)',
                            color: '#f1f5f9',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                        },
                        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                        error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                    }}
                />
            </ThemeProvider>
        </AuthProvider>
    );
}

// ── Root App ─────────────────────────────────────────────────────────────────
const clerkKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const clerkConfigured = clerkKey && !clerkKey.includes('your_publishable_key');

function App() {
    if (clerkConfigured) {
        return (
            <ClerkProvider publishableKey={clerkKey}>
                <InnerApp />
            </ClerkProvider>
        );
    }

    // No Clerk configured — wrap without ClerkProvider (dev/demo mode)
    return <InnerApp />;
}

export default App;
