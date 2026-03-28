/* ────────────────────────────────────────────────
   AlertCard — severity-colored alert card
   ──────────────────────────────────────────────── */

import { SEVERITY_COLORS } from '@/utils/constants';
import './Cards.css';

export default function AlertCard({ alert }) {
    const severity = alert.severity || alert.level || 'info';
    const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.info;

    return (
        <div className="alert-card" style={{ borderLeftColor: color }}>
            <div className="alert-card-header">
                <span className="alert-severity" style={{ color }}>
                    {severity === 'critical' || severity === 'high' ? '🔴' :
                        severity === 'warning' || severity === 'medium' ? '🟡' : '🟢'}
                    {' '}{severity.toUpperCase()}
                </span>
            </div>
            <h4 className="alert-card-title">{alert.title || 'Alert'}</h4>
            <p className="alert-card-message">{alert.message || alert.description}</p>
            {alert.advice && (
                <p className="alert-card-advice">
                    <strong>Advice:</strong> {alert.advice}
                </p>
            )}
        </div>
    );
}
