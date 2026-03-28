/* ────────────────────────────────────────────────
   AlertCard — severity-colored alert card
   ──────────────────────────────────────────────── */

import { SEVERITY_COLORS } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import './Cards.css';

export default function AlertCard({ alert, showChatLink = false }) {
    const navigate = useNavigate();
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
            <h4 className="alert-card-title">{alert.rule || alert.title || 'Alert'}</h4>
            <p className="alert-card-message">{alert.message || alert.description}</p>
            {alert.advice && (
                <p className="alert-card-advice">
                    <strong>Advice:</strong> {alert.advice}
                </p>
            )}
            {showChatLink && (
                <button
                    className="alert-chat-btn"
                    onClick={() =>
                        navigate('/chat', {
                            state: { prefill: `Tell me more about: ${alert.rule || alert.title}` },
                        })
                    }
                >
                    💬 Ask FinPilot about this
                </button>
            )}
        </div>
    );
}
