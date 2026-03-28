/* ────────────────────────────────────────────────
   SpendingBar — CSS bar chart for category breakdown
   ──────────────────────────────────────────────── */

import { CATEGORY_COLORS } from '@/utils/constants';
import './Charts.css';

export default function SpendingBar({ categoryBreakdown = [] }) {
    const entries = [...categoryBreakdown].sort((a, b) => b.amount - a.amount);
    const maxVal = entries.length > 0 ? entries[0].amount : 0;

    if (entries.length === 0) {
        return (
            <div className="spending-bar-empty">
                No spending data yet. Upload transactions to see your breakdown.
            </div>
        );
    }

    return (
        <div className="spending-bar-chart">
            {entries.map((cat, i) => (
                <div className="spending-bar-row" key={cat.categoryId || cat.categoryName}>
                    <div className="spending-bar-label">{cat.categoryName}</div>
                    <div className="spending-bar-track">
                        <div
                            className="spending-bar-fill"
                            style={{
                                width: `${(cat.amount / maxVal) * 100}%`,
                                background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                                animationDelay: `${i * 0.08}s`,
                            }}
                        />
                    </div>
                    <div className="spending-bar-amount">₹{cat.amount.toLocaleString('en-IN')}</div>
                </div>
            ))}
        </div>
    );
}
