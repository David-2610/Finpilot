/* ────────────────────────────────────────────────
   SpendingBar — CSS bar chart for categories
   ──────────────────────────────────────────────── */

import './Charts.css';

const CATEGORY_COLORS = [
    'var(--sage)', 'var(--dusk)', 'var(--pale-gold)', 'var(--blush)',
    'var(--mist)', 'var(--slate)', '#a59dd4', '#88b4a8',
    '#c9a87a', '#8fa8b5', '#b5a08a',
];

export default function SpendingBar({ totals = {} }) {
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const maxVal = entries.length > 0 ? entries[0][1] : 0;

    if (entries.length === 0) {
        return (
            <div className="spending-bar-empty">
                No spending data yet. Upload transactions to see your breakdown.
            </div>
        );
    }

    return (
        <div className="spending-bar-chart">
            {entries.map(([category, amount], i) => (
                <div className="spending-bar-row" key={category}>
                    <div className="spending-bar-label">{category}</div>
                    <div className="spending-bar-track">
                        <div
                            className="spending-bar-fill"
                            style={{
                                width: `${(amount / maxVal) * 100}%`,
                                background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                                animationDelay: `${i * 0.08}s`,
                            }}
                        />
                    </div>
                    <div className="spending-bar-amount">₹{amount.toLocaleString('en-IN')}</div>
                </div>
            ))}
        </div>
    );
}
