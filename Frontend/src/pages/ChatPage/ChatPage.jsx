/* ────────────────────────────────────────────────
   AI Insights Page — Gemini-powered financial advice
   ──────────────────────────────────────────────── */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import GlassCard from '@/components/Cards/GlassCard';
import Loader from '@/components/common/Loader';
import './ChatPage.css';

export default function ChatPage() {
    const navigate = useNavigate();
    const { summary, aiInsight, hasData, fetchSummary, fetchAIInsights, fetchChat, loading } = useFinance();
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState('');

    const initInsights = useCallback(async () => {
        if (hasData) {
            let currentSummary = summary;
            if (!currentSummary) {
                setIsLoading(true);
                currentSummary = await fetchSummary();
            }
            if (currentSummary && !aiInsight) {
                setIsLoading(true);
                await fetchAIInsights(currentSummary);
                setIsLoading(false);
            }
        }
    }, [hasData, summary, aiInsight, fetchSummary, fetchAIInsights]);

    // 1. Auto-fetch and Auto-insights on mount
    useEffect(() => {
        initInsights();
    }, [initInsights]);

    // Handle standard generate (Refresh)
    async function handleRefreshInsights() {
        setError('');
        setIsLoading(true);
        try {
            const sum = await fetchSummary();
            await fetchAIInsights(sum);
        } catch (err) {
            setError(err.message || 'Failed to refresh insights');
        }
        setIsLoading(false);
    }

    // --- Voice Logic (Hold to speak) ---
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                stream.getTracks().forEach(track => track.stop());
                setIsLoading(true);
                try {
                    await fetchChat(null, blob);
                } catch (err) {
                    setError('Failed to process voice: ' + err.message);
                }
                setIsLoading(false);
            };
            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            setError('');
        } catch (err) {
            setError('Microphone access denied: ' + err.message);
        }
    }

    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    }

    // --- Text Chat Logic ---
    async function handleSendChat() {
        if (!userInput.trim()) return;
        setIsLoading(true);
        setError('');
        try {
            await fetchChat(userInput, null);
            setUserInput('');
        } catch (err) {
            setError('Failed to send message: ' + err.message);
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
        <div className="chat-page">
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

            {/* AI Advisor Chat Board */}
            <GlassCard style={{ padding: '32px' }}>
                <div className="dash-ai-header" style={{ marginBottom: '16px' }}>
                    <span className="dash-ai-badge">🤖 AI Advisor Chat</span>
                </div>

                <div className="insights-result" style={{ minHeight: '120px' }}>
                    {isLoading ? (
                        <div style={{ padding: '20px 0', textAlign: 'center' }}>
                            <Loader text={isRecording ? "Listening..." : "Thinking..."} />
                        </div>
                    ) : aiInsight ? (
                        <p className="insights-advice-text">{aiInsight}</p>
                    ) : (
                        <p className="insights-empty-text">Ask me anything about your spending.</p>
                    )}
                </div>

                {/* New Chat Input Bar */}
                <div className="chat-input-container">
                    <textarea 
                        className="chat-textarea"
                        placeholder="Type a message or hold mic to speak..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                        rows="1"
                    />
                    <div className="chat-input-actions">
                        <button 
                            className={`chat-mic-btn ${isRecording ? 'recording' : ''}`}
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                        >
                            🎤
                        </button>
                        <button 
                            className="chat-send-btn" 
                            onClick={handleSendChat}
                            disabled={!userInput.trim() || isLoading}
                        >
                            ↗
                        </button>
                    </div>
                </div>

                {error && <p className="upload-error" style={{ marginTop: '12px' }}>{error}</p>}
                
                <div className="insights-actions" style={{ marginTop: '16px' }}>
                    <button className="insights-refresh-btn" onClick={handleRefreshInsights}>
                        ↻ Refresh Analysis
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
