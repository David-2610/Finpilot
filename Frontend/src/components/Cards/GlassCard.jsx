/* ────────────────────────────────────────────────
   GlassCard — reusable glassmorphism container
   ──────────────────────────────────────────────── */

import './Cards.css';

export default function GlassCard({ children, className = '', animate = true, ...props }) {
    return (
        <div
            className={`glass-card ${animate ? 'glass-card--animate' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
