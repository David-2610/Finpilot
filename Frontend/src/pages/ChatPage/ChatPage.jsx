/* ────────────────────────────────────────────────
   AI Chat Page — Voice and Text interface
   ──────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import GlassCard from '@/components/Cards/GlassCard';
import Loader from '@/components/common/Loader';
import './ChatPage.css';

export default function ChatPage() {
    const navigate = useNavigate();
    const { aiInsight, hasData, fetchChat, stopVoice } = useFinance();
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState('');

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
                    Upload your bank statement first to chat with the AI financial advisor.
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
                <p className="chat-eyebrow">AI Advisor</p>
                <h1 className="chat-title">Chat with <em>FinPilot</em></h1>
            </div>

            {/* AI Advisor Chat Board */}
            <GlassCard style={{ padding: '32px' }}>
                <div className="dash-ai-header" style={{ marginBottom: '16px' }}>
                    <span className="dash-ai-badge">🤖 Voice & Text Chat</span>
                </div>

                <div className="insights-result" style={{ minHeight: '160px' }}>
                    {isLoading ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <Loader text={isRecording ? "Listening..." : "Thinking..."} />
                        </div>
                    ) : aiInsight ? (
                        <p className="insights-advice-text">{aiInsight}</p>
                    ) : (
                        <p className="insights-empty-text">Hi! I'm your AI financial advisor. Ask me anything about your spending.</p>
                    )}
                </div>

                {/* Chat Input Bar */}
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
                            className="chat-stop-btn"
                            onClick={stopVoice}
                            title="Stop AI Voice"
                        >
                            ⏹️
                        </button>
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
            </GlassCard>
        </div>
    );
}
