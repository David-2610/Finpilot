/* ────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────── */

export const NAV_LINKS = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/upload', label: 'Upload', icon: '📤' },
    { path: '/insights', label: 'AI Insights', icon: '🤖' },
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

export const CATEGORY_COLORS = [
    'var(--sage)', 'var(--dusk)', 'var(--pale-gold)', 'var(--blush)',
    'var(--mist)', 'var(--slate)', '#a59dd4', '#88b4a8',
    '#c9a87a', '#8fa8b5', '#b5a08a',
];
