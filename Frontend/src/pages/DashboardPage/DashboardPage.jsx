/* ────────────────────────────────────────────────
   DashboardPage — summary, categories, transactions, AI
   ──────────────────────────────────────────────── */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useFinance } from '@/hooks/useFinance';
import { useAuth } from '@/hooks/useAuth';
import GlassCard from '@/components/Cards/GlassCard';
import StatCard from '@/components/Cards/StatCard';
import SpendingBar from '@/components/Charts/SpendingBar';
import './DashboardPage.css';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        transactions, summary, aiInsight, categories,
        loading, hasData, loadDashboardData, fetchAIInsights,
        isSpeaking, stopVoice
    } = useFinance();

    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    async function handleGetInsights() {
        if (!summary) return;
        setAiLoading(true);
        try {
            await fetchAIInsights(summary);
        } catch { /* silently fail */ }
        setAiLoading(false);
    }

    if (loading) {
        return (
            <div className="dash-empty">
                <div className="dash-empty-icon">⏳</div>
                <h2 className="dash-empty-title">Loading your data…</h2>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="dash-empty">
                <div className="dash-empty-icon">📊</div>
                <h2 className="dash-empty-title">No data yet</h2>
                <p className="dash-empty-desc">
                    Upload your bank statement to see your financial dashboard.
                </p>
                <button className="dash-empty-btn" onClick={() => navigate('/upload')}>
                    Upload Statement →
                </button>
            </div>
        );
    }

    const totalIncome = summary?.totalIncome || 0;
    const totalExpenses = summary?.totalExpenses || 0;
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;
    const categoryBreakdown = summary?.categoryBreakdown || [];
    const topCategory = categoryBreakdown.length > 0
        ? categoryBreakdown.reduce((max, c) => c.amount > max.amount ? c : max, categoryBreakdown[0])
        : null;
    const recentTxns = transactions.slice(0, 10);

    return (
        <div className="dash-page">
            {/* Header */}
            <div className="dash-header">
                <div>
                    <p className="dash-eyebrow">Financial Dashboard</p>
                    <h1 className="dash-title">
                        Welcome back, <em>{user?.name?.split(' ')[0] || 'there'}</em>
                    </h1>
                </div>
                <div className="dash-header-actions">
                    <button className="dash-action-btn dash-action-secondary" onClick={() => alert('Bank Link coming soon in V2!')}>
                        🔗 Link Bank Account
                    </button>
                    <button className="dash-action-btn dash-action-secondary" onClick={() => alert('Family accounts coming soon in V2!')}>
                        👨‍👩‍👦 Add Group Accounts
                    </button>
                    <button className="dash-action-btn" onClick={() => navigate('/upload')}>
                        + New Upload
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="dash-stats-row">
                <StatCard icon="💰" value={`₹${totalIncome.toLocaleString('en-IN')}`} label="Total Income" accentClass="icon-sage" />
                <StatCard icon="💸" value={`₹${totalExpenses.toLocaleString('en-IN')}`} label="Total Expenses" accentClass="icon-blush" />
                <StatCard icon="📈" value={`${savingsRate}%`} label="Savings Rate" accentClass="icon-dusk" />
                <StatCard icon="📋" value={transactions.length} label="Transactions" accentClass="icon-gold" />
            </div>

            {/* Main grid */}
            <div className="dash-grid">
                {/* Spending breakdown */}
                <GlassCard className="dash-spending-card">
                    <h3 className="dash-card-title">Spending by Category</h3>
                    <SpendingBar categoryBreakdown={categoryBreakdown} />
                </GlassCard>

                {/* Right column */}
                <div className="dash-right">
                    {/* AI Insight */}
                    <GlassCard className="dash-ai-card">
                        <div className="dash-ai-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className="dash-ai-badge">🤖 AI Insight</span>
                            {isSpeaking && (
                                <div className="speaking-indicator" onClick={stopVoice} style={{ cursor: 'pointer' }} title="Stop speaking">
                                    <div className="speaking-orb"></div>
                                    <span className="speaking-text" style={{ fontSize: '0.75rem', color: 'var(--sage)', marginLeft: '8px' }}>Speaking... (Click to stop)</span>
                                </div>
                            )}
                        </div>
                        <div className="dash-ai-text markdown-body">
                            {aiInsight ? (
                                <ReactMarkdown>{aiInsight}</ReactMarkdown>
                            ) : (
                                'Click below to get personalized AI-powered financial advice.'
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {!aiInsight ? (
                                <button
                                    className="dash-ai-chat-btn"
                                    onClick={handleGetInsights}
                                    disabled={aiLoading}
                                >
                                    {aiLoading ? '⏳ Generating…' : '✨ Generate AI Insights'}
                                </button>
                            ) : (
                                <button
                                    className="dash-ai-chat-btn dash-action-secondary"
                                    onClick={handleGetInsights}
                                    disabled={aiLoading}
                                >
                                    {aiLoading ? '⏳ Regenerating…' : '↻ Regenerate Insights'}
                                </button>
                            )}

                            <button className="dash-ai-chat-btn" onClick={() => navigate('/insights')}>
                                💬 Go to Chatbot
                            </button>
                        </div>
                    </GlassCard>

                    {/* Top Category */}
                    {topCategory && (
                        <GlassCard className="dash-top-card">
                            <p className="dash-top-label">Top Spending Category</p>
                            <h3 className="dash-top-value">{topCategory.categoryName}</h3>
                            <p className="dash-top-amount">₹{topCategory.amount?.toLocaleString('en-IN')}</p>
                        </GlassCard>
                    )}

                    {/* Savings */}
                    <GlassCard className="dash-savings-card">
                        <p className="dash-top-label">Net Savings</p>
                        <h3 className="dash-top-value" style={{ color: savings >= 0 ? 'var(--success)' : 'var(--error)' }}>
                            {savings >= 0 ? '+' : ''}₹{Math.abs(savings).toLocaleString('en-IN')}
                        </h3>
                        <p className="dash-top-amount">{savings >= 0 ? 'You saved this period!' : 'You overspent this period'}</p>
                    </GlassCard>
                </div>
            </div>

            {/* Recent Transactions */}
            {recentTxns.length > 0 && (
                <div className="dash-txn-section">
                    <h3 className="dash-section-title">📋 Recent Transactions</h3>
                    <GlassCard className="dash-txn-card">
                        <div className="dash-txn-table-wrap">
                            <table className="dash-txn-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTxns.map((txn) => (
                                        <tr key={txn._id}>
                                            <td className="dash-txn-date">
                                                {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </td>
                                            <td className="dash-txn-desc">
                                                {txn.merchant || txn.counterparty || txn.rawDescription?.substring(0, 40)}
                                            </td>
                                            <td>
                                                <span className="dash-txn-category">
                                                    {txn.categoryId?.icon || '📂'} {txn.categoryId?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className={`dash-txn-amount ${txn.type === 'credit' ? 'dash-txn-credit' : 'dash-txn-debit'}`}>
                                                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString('en-IN')}
                                            </td>
                                            <td>
                                                <span className={`dash-txn-type-badge ${txn.type === 'credit' ? 'dash-txn-type-credit' : 'dash-txn-type-debit'}`}>
                                                    {txn.type}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
