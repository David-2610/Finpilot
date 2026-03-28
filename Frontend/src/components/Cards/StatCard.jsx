/* ────────────────────────────────────────────────
   StatCard — metric display card
   ──────────────────────────────────────────────── */

import './Cards.css';

export default function StatCard({ icon, value, label, accentClass = 'icon-sage' }) {
    return (
        <div className="stat-card">
            <div className={`stat-card-icon ${accentClass}`}>
                {icon}
            </div>
            <div className="stat-card-body">
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label">{label}</div>
            </div>
        </div>
    );
}
