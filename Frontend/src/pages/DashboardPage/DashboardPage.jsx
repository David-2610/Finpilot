/* ────────────────────────────────────────────────
   DashboardPage — spending breakdown, alerts, AI
   ──────────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import GlassCard from '@/components/Cards/GlassCard';
import StatCard from '@/components/Cards/StatCard';
import AlertCard from '@/components/Cards/AlertCard';
import SpendingBar from '@/components/Charts/SpendingBar';
import './DashboardPage.css';

export default function DashboardPage() {
    const navigate = useNavigate();
    const {
        totals, alerts, summary, aiInsight, reply,
        ipfsHash, achievements, hasData, clearData,
    } = useFinance();

    if (!hasData) {
        return (
            <div className="dash-empty">
                <div className="dash-empty-icon">📊</div>
                <h2 className="dash-empty-title">No data yet</h2>
                <p className="dash-empty-desc">
                    Upload your transactions to see your financial dashboard.
                </p>
                <button className="dash-empty-btn" onClick={() => navigate('/upload')}>
                    Upload Transactions →
                </button>
            </div>
        );
    }

    const totalSpending = summary?.totalSpending || Object.values(totals).reduce((s, v) => s + v, 0);
    const categoryCount = summary?.categories || Object.keys(totals).length;
    const txnCount = summary?.totalTransactions || 0;
    const topCategory = summary?.topCategory;

    return (
        <div className="dash-page">
            {/* Header */}
            <div className="dash-header">
                <div>
                    <p className="dash-eyebrow">Financial Dashboard</p>
                    <h1 className="dash-title">Your money, <em>decoded</em></h1>
                </div>
                <div className="dash-header-actions">
                    <button className="dash-action-btn" onClick={() => navigate('/upload')}>
                        + New Upload
                    </button>
                    <button className="dash-action-btn dash-action-secondary" onClick={clearData}>
                        Clear Data
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="dash-stats-row">
                <StatCard icon="💰" value={`₹${totalSpending.toLocaleString('en-IN')}`} label="Total Spending" accentClass="icon-sage" />
                <StatCard icon="📂" value={categoryCount} label="Categories" accentClass="icon-dusk" />
                <StatCard icon="📋" value={txnCount} label="Transactions" accentClass="icon-gold" />
                <StatCard icon="⚠️" value={alerts.length} label="Alerts" accentClass="icon-blush" />
            </div>

            {/* Main grid */}
            <div className="dash-grid">
                {/* Spending breakdown */}
                <GlassCard className="dash-spending-card">
                    <h3 className="dash-card-title">Spending Breakdown</h3>
                    <SpendingBar totals={totals} />
                </GlassCard>

                {/* Right column */}
                <div className="dash-right">
                    {/* AI Insight */}
                    <GlassCard className="dash-ai-card">
                        <div className="dash-ai-header">
                            <span className="dash-ai-badge">🤖 AI Insight</span>
                        </div>
                        <p className="dash-ai-text">{aiInsight || reply || 'No AI insight available.'}</p>
                        <button className="dash-ai-chat-btn" onClick={() => navigate('/chat')}>
                            💬 Ask follow-up
                        </button>
                    </GlassCard>

                    {/* Top Category */}
                    {topCategory && (
                        <GlassCard className="dash-top-card">
                            <p className="dash-top-label">Top Spending Category</p>
                            <h3 className="dash-top-value">{topCategory[0]}</h3>
                            <p className="dash-top-amount">₹{topCategory[1]?.toLocaleString('en-IN')}</p>
                        </GlassCard>
                    )}

                    {/* IPFS Hash */}
                    {ipfsHash && (
                        <GlassCard className="dash-ipfs-card">
                            <p className="dash-ipfs-label">📦 IPFS Hash</p>
                            <code className="dash-ipfs-hash">{ipfsHash}</code>
                        </GlassCard>
                    )}
                </div>
            </div>

            {/* Alerts section */}
            {alerts.length > 0 && (
                <div className="dash-alerts-section">
                    <h3 className="dash-section-title">
                        <span>⚠️</span> Active Alerts ({alerts.length})
                    </h3>
                    <div className="dash-alerts-grid">
                        {alerts.map((alert, i) => (
                            <AlertCard key={i} alert={alert} showChatLink />
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {achievements && achievements.earned > 0 && (
                <GlassCard className="dash-achievements">
                    <h3 className="dash-section-title">🏆 Achievements Earned</h3>
                    <div className="dash-achieve-stats">
                        <div className="dash-achieve-num">{achievements.earned}</div>
                        <div className="dash-achieve-label">
                            new achievement{achievements.earned > 1 ? 's' : ''} earned
                            {achievements.total > 0 && ` · ${achievements.total} total`}
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
