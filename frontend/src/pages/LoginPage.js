import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { loginAsGuest, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || '';
    const clerkConfigured = publishableKey && !publishableKey.includes('your_publishable_key');

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleGuestLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            loginAsGuest();
            setIsLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />

            <div className="relative w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">HRMS Lite</h1>
                    <p className="text-slate-400 mt-1 text-sm">Human Resource Management System</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
                    <p className="text-slate-400 text-sm mb-6">Sign in to manage your team</p>

                    {/* Clerk Sign In Button */}
                    {clerkConfigured ? (
                        <SignInButton mode="modal">
                            <button
                                type="button"
                                className="flex items-center justify-center w-full gap-3 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 mb-4"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Sign in with Clerk
                            </button>
                        </SignInButton>
                    ) : (
                        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-amber-300 text-sm font-medium">Clerk not configured</p>
                                <p className="text-amber-400/70 text-xs mt-0.5">Add your <code className="bg-amber-500/20 px-1 rounded">REACT_APP_CLERK_PUBLISHABLE_KEY</code> to <code className="bg-amber-500/20 px-1 rounded">.env</code> to enable login.</p>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-slate-500 text-xs font-medium">OR</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Guest Mode Button */}
                    <button
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <svg className="w-5 h-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                        Continue as Guest
                        <span className="ml-auto text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Read-only</span>
                    </button>

                    {/* Guest mode note */}
                    <p className="text-slate-500 text-xs text-center mt-4">
                        Guest mode allows viewing employees &amp; attendance — no edits allowed.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    HRMS Lite · Built by Aman Singh
                </p>
            </div>
        </div>
    );
}
