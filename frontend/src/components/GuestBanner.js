import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, Lock } from 'lucide-react';
import './GuestBanner.css';

/**
 * Shown at the top of pages when the user is in Guest (read-only) mode.
 * Pass `action` to describe what specific action is restricted on that page.
 */
export default function GuestBanner({ action = 'editing data' }) {
    return null; // Only render when guest
}

export function GuestBannerConditional({ action = 'editing data' }) {
    const { isGuest } = useAuth();
    if (!isGuest) return null;

    return (
        <div className="guest-banner" role="alert" aria-live="polite">
            <div className="guest-banner-inner">
                <Eye size={16} className="guest-banner-eye" />
                <span className="guest-banner-text">
                    <strong>Guest Mode — View Only.</strong>{' '}
                    {`You are viewing this page as a guest. ${action.charAt(0).toUpperCase() + action.slice(1)} requires admin sign-in.`}
                </span>
                <div className="guest-banner-lock">
                    <Lock size={13} />
                    Read-only
                </div>
            </div>
        </div>
    );
}
