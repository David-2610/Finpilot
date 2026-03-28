/* ────────────────────────────────────────────────
   UploadPage — transaction upload + process
   ──────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFinance } from '@/hooks/useFinance';
import { SAMPLE_TRANSACTIONS } from '@/utils/constants';
import GlassCard from '@/components/Cards/GlassCard';
import Loader from '@/components/common/Loader';
import './UploadPage.css';

export default function UploadPage() {
    const navigate = useNavigate();
    const { wallet } = useAuth();
    const { processTransactions, processing, hasData } = useFinance();

    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [statusMsg, setStatusMsg] = useState('');

    function useSampleData() {
        setJsonText(JSON.stringify(SAMPLE_TRANSACTIONS, null, 2));
        setError('');
    }

    async function handleProcess() {
        setError('');
        let txns;

        try {
            txns = JSON.parse(jsonText);
            if (!Array.isArray(txns) || txns.length === 0) {
                setError('Please provide a non-empty JSON array of transactions.');
                return;
            }
        } catch {
            setError('Invalid JSON format. Please check and try again.');
            return;
        }

        const steps = [
            { pct: 15, msg: 'Storing on IPFS…' },
            { pct: 35, msg: 'Categorizing transactions…' },
            { pct: 55, msg: 'Generating AI insights…' },
            { pct: 75, msg: 'Preparing advice…' },
            { pct: 90, msg: 'Evaluating achievements…' },
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                setProgress(steps[i].pct);
                setStatusMsg(steps[i].msg);
                i++;
            }
        }, 500);

        try {
            await processTransactions(txns, wallet || 'anonymous');
            clearInterval(interval);
            setProgress(100);
            setStatusMsg('Complete! Redirecting…');
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            clearInterval(interval);
            setProgress(0);
            setStatusMsg('');
            setError(err.response?.data?.error || err.message || 'Processing failed. Is the backend running?');
        }
    }

    if (processing) {
        return (
            <div className="upload-loading">
                <Loader text={statusMsg || 'Processing…'} progress={progress} />
                <div className="upload-loading-pills">
                    <span className="upload-pill">📦 IPFS Storage</span>
                    <span className="upload-pill">📊 AI Analysis</span>
                    <span className="upload-pill">🏆 CertifyX</span>
                </div>
            </div>
        );
    }

    return (
        <div className="upload-page">
            <div className="upload-header">
                <p className="upload-eyebrow">Upload Transactions</p>
                <h1 className="upload-title">Feed your data to <em>FinPilot</em></h1>
                <p className="upload-desc">
                    Paste your transactions as JSON. FinPilot will categorize, analyze,
                    generate insights, and store on IPFS — all in one pipeline.
                </p>
            </div>

            <div className="upload-grid">
                {/* Left: Input */}
                <GlassCard className="upload-input-card">
                    <div className="upload-input-header">
                        <h3 className="upload-input-title">Transaction Data</h3>
                        <button className="upload-sample-btn" onClick={useSampleData}>
                            📋 Use Sample Data
                        </button>
                    </div>

                    <textarea
                        className="upload-textarea"
                        value={jsonText}
                        onChange={(e) => {
                            setJsonText(e.target.value);
                            setError('');
                        }}
                        placeholder={`[\n  { "description": "Swiggy Order", "amount": 450 },\n  { "description": "Netflix Subscription", "amount": 649 }\n]`}
                        rows={14}
                    />

                    {error && <p className="upload-error">{error}</p>}

                    <button
                        className="upload-process-btn"
                        onClick={handleProcess}
                        disabled={!jsonText.trim()}
                    >
                        <span>Process Full Pipeline</span>
                    </button>

                    <p className="upload-format-hint">
                        Format: <code>[{`{ "description": string, "amount": number }`}]</code>
                    </p>
                </GlassCard>

                {/* Right: Info */}
                <div className="upload-info-stack">
                    <GlassCard className="upload-info-card">
                        <div className="upload-info-icon icon-sage">📦</div>
                        <h4>IPFS Storage</h4>
                        <p>Your data is hashed and stored immutably on the decentralized IPFS network.</p>
                    </GlassCard>
                    <GlassCard className="upload-info-card">
                        <div className="upload-info-icon icon-dusk">📊</div>
                        <h4>Smart Categorization</h4>
                        <p>11 intelligent categories with keyword matching classify every transaction automatically.</p>
                    </GlassCard>
                    <GlassCard className="upload-info-card">
                        <div className="upload-info-icon icon-gold">🤖</div>
                        <h4>AI Insights</h4>
                        <p>Gemini-powered analysis generates personalized financial advice from your actual data.</p>
                    </GlassCard>
                    <GlassCard className="upload-info-card">
                        <div className="upload-info-icon icon-blush">🏆</div>
                        <h4>CertifyX Achievements</h4>
                        <p>Earn badges and certificates for smart financial behavior tracked on-chain.</p>
                    </GlassCard>

                    {hasData && (
                        <button className="upload-view-btn" onClick={() => navigate('/dashboard')}>
                            View Existing Dashboard →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
