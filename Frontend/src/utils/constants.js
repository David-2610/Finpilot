/* ────────────────────────────────────────────────
   Constants & sample data
   ──────────────────────────────────────────────── */

export const API_BASE = '/api';

export const SAMPLE_TRANSACTIONS = [
    { description: 'Swiggy Order', amount: 450 },
    { description: 'Netflix Subscription', amount: 649 },
    { description: 'Uber Ride', amount: 250 },
    { description: 'Amazon Shopping', amount: 2999 },
    { description: 'Electricity Bill', amount: 1800 },
    { description: 'Gym Membership', amount: 1200 },
    { description: 'Grocery Store', amount: 3200 },
    { description: 'Spotify Premium', amount: 119 },
    { description: 'Petrol', amount: 2500 },
    { description: 'Movie Tickets', amount: 600 },
    { description: 'SIP Investment', amount: 5000 },
    { description: 'Medical Checkup', amount: 1500 },
    { description: 'Restaurant Dinner', amount: 1800 },
    { description: 'Hotstar Subscription', amount: 299 },
    { description: 'Auto Rickshaw', amount: 150 },
];

export const NAV_LINKS = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/upload', label: 'Upload', icon: '📤' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
];

export const SEVERITY_COLORS = {
    critical: 'var(--blush)',
    warning: 'var(--pale-gold)',
    info: 'var(--sage)',
    high: 'var(--blush)',
    medium: 'var(--pale-gold)',
    low: 'var(--sage)',
};
