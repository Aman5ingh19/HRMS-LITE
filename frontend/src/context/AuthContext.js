import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const GUEST_SESSION_KEY = 'hrms_guest_mode';

export function AuthProvider({ children, clerkUser }) {
    const [isGuest, setIsGuest] = useState(() => {
        return sessionStorage.getItem(GUEST_SESSION_KEY) === 'true';
    });

    const isAuthenticated = !!clerkUser || isGuest;
    const isAdmin = !!clerkUser && !isGuest;

    const loginAsGuest = useCallback(() => {
        sessionStorage.setItem(GUEST_SESSION_KEY, 'true');
        setIsGuest(true);
    }, []);

    const logoutGuest = useCallback(() => {
        sessionStorage.removeItem(GUEST_SESSION_KEY);
        setIsGuest(false);
    }, []);

    // If real user signs in, clear guest mode
    useEffect(() => {
        if (clerkUser) {
            sessionStorage.removeItem(GUEST_SESSION_KEY);
            setIsGuest(false);
        }
    }, [clerkUser]);

    return (
        <AuthContext.Provider value={{ isGuest, isAuthenticated, isAdmin, clerkUser, loginAsGuest, logoutGuest }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

export default AuthContext;
