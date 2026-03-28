/* ────────────────────────────────────────────────
   AlertsPage — severity-colored alert cards
   ──────────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import AlertCard from '@/components/Cards/AlertCard';
import GlassCard from '@/components/Cards/GlassCard';
import './AlertsPage.css';

export default function AlertsPage() {
    const navigate = useNavigate();
    const { alerts, hasData, summary } = useFinance();

    if (!hasData) {
        return (
            <div className="alerts-empty">
                <div className="alerts-empty-icon">🔔</div>
                <h2 className="alerts-empty-title">No alerts yet</h2>
                <p className="alerts-empty-desc">
                    Upload your transactions to get real-time financial alerts and advice.
                </p>
                <button className="alerts-empty-btn" onClick={() => navigate('/upload')}>
                    Upload Transactions →
                </button>
            </div>
        );
    }

    const criticalAlerts = alerts.filter(
        (a) => a.severity === 'critical' || a.severity === 'high'
    );
    const warningAlerts = alerts.filter(
        (a) => a.severity === 'warning' || a.severity === 'medium'
    );
    const infoAlerts = alerts.filter(
        (a) =>
            !['critical', 'high', 'warning', 'medium'].includes(a.severity)
    );

    return (
        <div className="alerts-page">
            <div className="alerts-header">
                <div>
                    <p className="alerts-eyebrow">Financial Alerts</p>
                    <h1 className="alerts-title">
                        Watchdog <em>report</em>
                    </h1>
                </div>
                {alerts.length > 0 && (
                    <div className="alerts-summary-pills">
                        {criticalAlerts.length > 0 && (
                            <span className="alerts-pill alerts-pill--critical">
                                🔴 {criticalAlerts.length} Critical
                            </span>
                        )}
                        {warningAlerts.length > 0 && (
                            <span className="alerts-pill alerts-pill--warning">
                                🟡 {warningAlerts.length} Warning
                            </span>
                        )}
                        {infoAlerts.length > 0 && (
                            <span className="alerts-pill alerts-pill--info">
                                🟢 {infoAlerts.length} Info
                            </span>
                        )}
                    </div>
                )}
            </div>

            {alerts.length === 0 ? (
                <GlassCard className="alerts-none">
                    <div className="alerts-none-icon">✅</div>
                    <h3 className="alerts-none-title">All clear!</h3>
                    <p className="alerts-none-desc">
                        No financial alerts detected. Your spending patterns look healthy.
                    </p>
                </GlassCard>
            ) : (
                <>
                    {/* Critical */}
                    {criticalAlerts.length > 0 && (
                        <div className="alerts-group">
                            <h3 className="alerts-group-title alerts-group--critical">
                                🔴 Critical Alerts
                            </h3>
                            <div className="alerts-grid">
                                {criticalAlerts.map((alert, i) => (
                                    <AlertCard key={`c-${i}`} alert={alert} showChatLink />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Warning */}
                    {warningAlerts.length > 0 && (
                        <div className="alerts-group">
                            <h3 className="alerts-group-title alerts-group--warning">
                                🟡 Warnings
                            </h3>
                            <div className="alerts-grid">
                                {warningAlerts.map((alert, i) => (
                                    <AlertCard key={`w-${i}`} alert={alert} showChatLink />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    {infoAlerts.length > 0 && (
                        <div className="alerts-group">
                            <h3 className="alerts-group-title alerts-group--info">
                                🟢 Insights
                            </h3>
                            <div className="alerts-grid">
                                {infoAlerts.map((alert, i) => (
                                    <AlertCard key={`i-${i}`} alert={alert} showChatLink />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Summary */}
            {summary && (
                <GlassCard className="alerts-summary-card">
                    <h3 className="alerts-summary-title">📋 Analysis Summary</h3>
                    <div className="alerts-summary-grid">
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">{summary.totalTransactions}</span>
                            <span className="alerts-summary-label">Transactions</span>
                        </div>
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">₹{summary.totalSpending?.toLocaleString('en-IN')}</span>
                            <span className="alerts-summary-label">Total Spending</span>
                        </div>
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">{summary.categories}</span>
                            <span className="alerts-summary-label">Categories</span>
                        </div>
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">{summary.alertCount}</span>
                            <span className="alerts-summary-label">Alerts Triggered</span>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
