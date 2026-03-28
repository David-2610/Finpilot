/* ────────────────────────────────────────────────
   AI Insights Page — Gemini-powered financial advice
   ──────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import GlassCard from '@/components/Cards/GlassCard';
import Loader from '@/components/common/Loader';
import './ChatPage.css';

export default function ChatPage() {
    const navigate = useNavigate();
    const { summary, aiInsight, hasData, fetchSummary, fetchAIInsights, loading } = useFinance();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!summary && hasData) {
            fetchSummary();
        }
    }, [summary, hasData, fetchSummary]);

    async function handleGenerateInsights() {
        setError('');
        setIsLoading(true);
        try {
            if (!summary) {
                const sum = await fetchSummary();
                await fetchAIInsights(sum);
            } else {
                await fetchAIInsights(summary);
            }
        } catch (err) {
            setError(err.message || 'Failed to generate insights');
        }
        setIsLoading(false);
    }

    if (!hasData) {
        return (
            <div className="dash-empty">
                <div className="dash-empty-icon">🤖</div>
                <h2 className="dash-empty-title">No data yet</h2>
                <p className="dash-empty-desc">
                    Upload your bank statement first to get personalized AI financial advice.
                </p>
                <button className="dash-empty-btn" onClick={() => navigate('/upload')}>
                    Upload Statement →
                </button>
            </div>
        );
    }

    return (
        <div className="chat-page" style={{ height: 'auto' }}>
            <div className="chat-header">
                <p className="chat-eyebrow">AI Financial Advisor</p>
                <h1 className="chat-title">Insights from <em>FinPilot</em></h1>
            </div>

            {/* Summary overview */}
            {summary && (
                <GlassCard className="insights-summary-card" style={{ marginBottom: '24px', padding: '28px' }}>
                    <h3 className="dash-card-title">📊 Your Financial Summary</h3>
                    <div className="insights-stats-grid">
                        <div className="insights-stat">
                            <span className="insights-stat-value insights-credit">
                                ₹{summary.totalIncome?.toLocaleString('en-IN') || '0'}
                            </span>
                            <span className="insights-stat-label">Total Income</span>
                        </div>
                        <div className="insights-stat">
                            <span className="insights-stat-value insights-debit">
                                ₹{summary.totalExpenses?.toLocaleString('en-IN') || '0'}
                            </span>
                            <span className="insights-stat-label">Total Expenses</span>
                        </div>
                        <div className="insights-stat">
                            <span className="insights-stat-value" style={{
                                color: (summary.totalIncome - summary.totalExpenses) >= 0 ? 'var(--success)' : 'var(--error)'
                            }}>
                                ₹{Math.abs(summary.totalIncome - summary.totalExpenses).toLocaleString('en-IN')}
                            </span>
                            <span className="insights-stat-label">
                                {(summary.totalIncome - summary.totalExpenses) >= 0 ? 'Net Savings' : 'Net Deficit'}
                            </span>
                        </div>
                        <div className="insights-stat">
                            <span className="insights-stat-value">
                                {summary.categoryBreakdown?.length || 0}
                            </span>
                            <span className="insights-stat-label">Categories</span>
                        </div>
                    </div>

                    {/* Category breakdown */}
                    {summary.categoryBreakdown?.length > 0 && (
                        <div className="insights-categories">
                            <h4 className="insights-cat-title">Category Breakdown</h4>
                            <div className="insights-cat-list">
                                {summary.categoryBreakdown.map((cat, i) => (
                                    <div className="insights-cat-item" key={cat.categoryId || i}>
                                        <span className="insights-cat-name">{cat.categoryName}</span>
                                        <span className="insights-cat-amount">₹{cat.amount?.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </GlassCard>
            )}

            {/* AI Insights */}
            <GlassCard style={{ padding: '32px' }}>
                <div className="dash-ai-header" style={{ marginBottom: '16px' }}>
                    <span className="dash-ai-badge">🤖 AI-Powered Advice</span>
                </div>

                {isLoading && (
                    <div style={{ padding: '40px 0', textAlign: 'center' }}>
                        <Loader text="Generating AI insights…" />
                    </div>
                )}

                {!isLoading && !aiInsight && (
                    <div className="insights-empty">
                        <p className="insights-empty-text">
                            Get personalized financial advice powered by Gemini AI.
                            We'll analyze your spending patterns, income, and category breakdown
                            to give you actionable cost-cutting strategies.
                        </p>
                        <button className="insights-generate-btn" onClick={handleGenerateInsights}>
                            <span>🤖</span>
                            <span>Generate AI Insights</span>
                        </button>
                    </div>
                )}

                {!isLoading && aiInsight && (
                    <div className="insights-result">
                        <p className="insights-advice-text">{aiInsight}</p>
                        <div className="insights-actions">
                            <button className="insights-refresh-btn" onClick={handleGenerateInsights}>
                                ↻ Refresh Insights
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="upload-error" style={{ marginTop: '12px' }}>{error}</p>
                )}
            </GlassCard>
        </div>
    );
}
