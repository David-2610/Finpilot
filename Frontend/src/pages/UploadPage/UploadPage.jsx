/* ────────────────────────────────────────────────
   UploadPage — CSV file upload to backend
   ──────────────────────────────────────────────── */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import GlassCard from '@/components/Cards/GlassCard';
import Loader from '@/components/common/Loader';
import './UploadPage.css';

export default function UploadPage() {
    const navigate = useNavigate();
    const { uploadCSV, loading, hasData } = useFinance();

    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [statusMsg, setStatusMsg] = useState('');
    const [uploadResult, setUploadResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    function handleFileSelect(selectedFile) {
        setError('');
        setUploadResult(null);
        if (selectedFile) {
            const ext = selectedFile.name.split('.').pop().toLowerCase();
            if (ext !== 'csv') {
                setError('Please upload a CSV file (.csv)');
                return;
            }
            setFile(selectedFile);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave() {
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileSelect(droppedFile);
    }

    async function handleUpload() {
        if (!file) return;
        setError('');

        const steps = [
            { pct: 20, msg: 'Uploading CSV file…' },
            { pct: 45, msg: 'Parsing transactions…' },
            { pct: 65, msg: 'Auto-categorizing…' },
            { pct: 85, msg: 'Saving to database…' },
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                setProgress(steps[i].pct);
                setStatusMsg(steps[i].msg);
                i++;
            }
        }, 600);

        try {
            const result = await uploadCSV(file);
            clearInterval(interval);
            setProgress(100);
            setStatusMsg('Upload complete!');
            setUploadResult(result);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            clearInterval(interval);
            setProgress(0);
            setStatusMsg('');
            setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
        }
    }

    if (loading) {
        return (
            <div className="upload-loading">
                <Loader text={statusMsg || 'Processing…'} progress={progress} />
                <div className="upload-loading-pills">
                    <span className="upload-pill">📄 CSV Parsing</span>
                    <span className="upload-pill">📊 Auto-Categorization</span>
                    <span className="upload-pill">🤖 AI Analysis</span>
                </div>
            </div>
        );
    }

    return (
        <div className="upload-page">
            <div className="upload-header">
                <p className="upload-eyebrow">Upload Statement</p>
                <h1 className="upload-title">Feed your data to <em>FinPilot</em></h1>
                <p className="upload-desc">
                    Upload your bank statement as a CSV file. FinPilot will parse, auto-categorize,
                    and analyze every transaction — ready for your dashboard in seconds.
                </p>
            </div>

            <div className="upload-grid">
                {/* Left: Upload area */}
                <GlassCard className="upload-input-card">
                    <div className="upload-input-header">
                        <h3 className="upload-input-title">Bank Statement (CSV)</h3>
                    </div>

                    {/* Drop zone */}
                    <div
                        className={`upload-dropzone ${isDragging ? 'upload-dropzone--active' : ''} ${file ? 'upload-dropzone--has-file' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                        />

                        {file ? (
                            <div className="upload-file-info">
                                <div className="upload-file-icon">📄</div>
                                <div>
                                    <p className="upload-file-name">{file.name}</p>
                                    <p className="upload-file-size">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                    className="upload-file-remove"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="upload-drop-content">
                                <div className="upload-drop-icon">📤</div>
                                <p className="upload-drop-text">
                                    <strong>Drop your CSV here</strong> or click to browse
                                </p>
                                <p className="upload-drop-hint">Supports SBI bank statement format (.csv)</p>
                            </div>
                        )}
                    </div>

                    {error && <p className="upload-error">{error}</p>}

                    {uploadResult && (
                        <div className="upload-success-msg">
                            ✅ Successfully processed {uploadResult.count} transactions!
                        </div>
                    )}

                    <button
                        className="upload-process-btn"
                        onClick={handleUpload}
                        disabled={!file}
                    >
                        <span>Upload & Process</span>
                    </button>

                    <p className="upload-format-hint">
                        Format: CSV bank statement with columns like Date, Description, Debit, Credit, Balance
                    </p>
                </GlassCard>

                {/* Right: Info */}
                <div className="upload-info-stack">
                    <GlassCard className="upload-info-card">
                        <div className="upload-info-icon icon-sage">📄</div>
                        <h4>CSV Parsing</h4>
                        <p>Your bank statement is securely parsed and transactions are extracted with dates, amounts, and descriptions.</p>
                    </GlassCard>
                    <GlassCard className="upload-info-card">
                        <div className="upload-info-icon icon-dusk">📊</div>
                        <h4>Smart Categorization</h4>
                        <p>Keyword-based auto-categorization classifies every transaction into categories like Groceries, Subscriptions, Income, etc.</p>
                    </GlassCard>
                    <GlassCard className="upload-info-card">
                        <div className="upload-info-icon icon-gold">🤖</div>
                        <h4>AI Insights</h4>
                        <p>Gemini-powered analysis generates personalized financial advice from your actual spending data.</p>
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
