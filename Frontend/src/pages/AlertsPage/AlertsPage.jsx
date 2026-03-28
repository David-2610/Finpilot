/* ────────────────────────────────────────────────
   AlertsPage — client-side computed financial alerts
   ──────────────────────────────────────────────── */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import AlertCard from '@/components/Cards/AlertCard';
import GlassCard from '@/components/Cards/GlassCard';
import './AlertsPage.css';

function computeAlerts(transactions, summary) {
    const alerts = [];

    if (!summary || !transactions?.length) return alerts;

    const { totalIncome, totalExpenses, categoryBreakdown } = summary;

    // 1. Overspending alert
    if (totalExpenses > totalIncome && totalIncome > 0) {
        alerts.push({
            severity: 'critical',
            title: 'Overspending Detected',
            message: `Your expenses (₹${totalExpenses.toLocaleString('en-IN')}) exceed your income (₹${totalIncome.toLocaleString('en-IN')}).`,
            advice: 'Review your spending categories and reduce non-essential expenses to bring spending below your income.',
        });
    }

    // 2. High spending categories (>30% of total expenses)
    if (categoryBreakdown?.length) {
        categoryBreakdown.forEach((cat) => {
            const pct = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
            if (pct > 30) {
                alerts.push({
                    severity: 'warning',
                    title: `High Spending: ${cat.categoryName}`,
                    message: `${cat.categoryName} accounts for ${pct.toFixed(1)}% of your total expenses (₹${cat.amount.toLocaleString('en-IN')}).`,
                    advice: `Consider setting a budget limit for ${cat.categoryName} to keep it below 25% of total spending.`,
                });
            }
        });
    }

    // 3. Low savings rate
    if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
        if (savingsRate > 0 && savingsRate < 20) {
            alerts.push({
                severity: 'warning',
                title: 'Low Savings Rate',
                message: `Your savings rate is only ${savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20%.`,
                advice: 'Try automating savings by setting up a recurring transfer to a savings account at the start of each month.',
            });
        }
    }

    // 4. Low balance detection
    const sortedTxns = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestWithBalance = sortedTxns.find((t) => t.balanceAfter != null);
    if (latestWithBalance && latestWithBalance.balanceAfter < 5000) {
        alerts.push({
            severity: 'critical',
            title: 'Low Account Balance',
            message: `Your latest balance is ₹${latestWithBalance.balanceAfter.toLocaleString('en-IN')}, which is below ₹5,000.`,
            advice: 'Maintain a minimum balance buffer of ₹5,000 to avoid overdraft fees and ensure emergency readiness.',
        });
    }

    // 5. Recurring charges info
    const recurring = transactions.filter((t) => t.isRecurring);
    if (recurring.length > 0) {
        const totalRecurring = recurring.reduce((sum, t) => sum + t.amount, 0);
        alerts.push({
            severity: 'info',
            title: `${recurring.length} Recurring Charges Found`,
            message: `You have ${recurring.length} recurring charges totaling ₹${totalRecurring.toLocaleString('en-IN')}.`,
            advice: 'Review your subscriptions and cancel any unused services to save money.',
        });
    }

    // 6. Good savings
    if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
        if (savingsRate >= 30) {
            alerts.push({
                severity: 'info',
                title: 'Great Savings!',
                message: `You're saving ${savingsRate.toFixed(1)}% of your income — excellent financial discipline!`,
                advice: 'Consider investing your surplus in mutual funds or fixed deposits for long-term growth.',
            });
        }
    }

    return alerts;
}

export default function AlertsPage() {
    const navigate = useNavigate();
    const { transactions, summary, hasData, loadDashboardData } = useFinance();

    useEffect(() => {
        if (!hasData) return;
        if (!summary || !transactions?.length) {
            loadDashboardData();
        }
    }, [hasData, summary, transactions, loadDashboardData]);

    if (!hasData) {
        return (
            <div className="alerts-empty">
                <div className="alerts-empty-icon">🔔</div>
                <h2 className="alerts-empty-title">No alerts yet</h2>
                <p className="alerts-empty-desc">
                    Upload your transactions to get real-time financial alerts and advice.
                </p>
                <button className="alerts-empty-btn" onClick={() => navigate('/upload')}>
                    Upload Statement →
                </button>
            </div>
        );
    }

    const alerts = computeAlerts(transactions, summary);

    const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
    const warningAlerts = alerts.filter((a) => a.severity === 'warning');
    const infoAlerts = alerts.filter((a) => a.severity === 'info');

    return (
        <div className="alerts-page">
            <div className="alerts-header">
                <div>
                    <p className="alerts-eyebrow">Financial Alerts</p>
                    <h1 className="alerts-title">
                        Smart <em>alerts</em>
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
                    {criticalAlerts.length > 0 && (
                        <div className="alerts-group">
                            <h3 className="alerts-group-title alerts-group--critical">
                                🔴 Critical Alerts
                            </h3>
                            <div className="alerts-grid">
                                {criticalAlerts.map((alert, i) => (
                                    <AlertCard key={`c-${i}`} alert={alert} />
                                ))}
                            </div>
                        </div>
                    )}

                    {warningAlerts.length > 0 && (
                        <div className="alerts-group">
                            <h3 className="alerts-group-title alerts-group--warning">
                                🟡 Warnings
                            </h3>
                            <div className="alerts-grid">
                                {warningAlerts.map((alert, i) => (
                                    <AlertCard key={`w-${i}`} alert={alert} />
                                ))}
                            </div>
                        </div>
                    )}

                    {infoAlerts.length > 0 && (
                        <div className="alerts-group">
                            <h3 className="alerts-group-title alerts-group--info">
                                🟢 Insights
                            </h3>
                            <div className="alerts-grid">
                                {infoAlerts.map((alert, i) => (
                                    <AlertCard key={`i-${i}`} alert={alert} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Summary */}
            {summary && (
                <GlassCard className="alerts-summary-card">
                    <h3 className="alerts-summary-title">📋 Financial Overview</h3>
                    <div className="alerts-summary-grid">
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">{transactions.length}</span>
                            <span className="alerts-summary-label">Transactions</span>
                        </div>
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">₹{summary.totalExpenses?.toLocaleString('en-IN')}</span>
                            <span className="alerts-summary-label">Total Spending</span>
                        </div>
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">{summary.categoryBreakdown?.length || 0}</span>
                            <span className="alerts-summary-label">Categories</span>
                        </div>
                        <div className="alerts-summary-item">
                            <span className="alerts-summary-num">{alerts.length}</span>
                            <span className="alerts-summary-label">Alerts Triggered</span>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
