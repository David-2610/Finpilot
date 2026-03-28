/* ────────────────────────────────────────────────
   ChatPage — AI chat interface
   ──────────────────────────────────────────────── */

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import * as api from '@/services/api';
import ChatBubble from '@/components/Chat/ChatBubble';
import ChatInput from '@/components/Chat/ChatInput';
import GlassCard from '@/components/Cards/GlassCard';
import './ChatPage.css';

export default function ChatPage() {
    const location = useLocation();
    const { totals, alerts, hasData } = useFinance();
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    /* Auto-scroll to bottom */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    /* Pre-fill from navigation state (e.g. from AlertCard) */
    useEffect(() => {
        const prefill = location.state?.prefill;
        if (prefill && messages.length === 0) {
            handleSend(prefill);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Welcome message */
    useEffect(() => {
        if (messages.length === 0 && !location.state?.prefill) {
            setMessages([
                {
                    id: 'welcome',
                    text: hasData
                        ? "Hi! I'm FinPilot — your AI financial assistant. I've already analyzed your transaction data. Ask me anything about your spending, savings, or financial health."
                        : "Hi! I'm FinPilot. Upload your transactions first to get personalized financial advice, or ask me general finance questions.",
                    isUser: false,
                    time: formatTime(),
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function formatTime() {
        return new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    async function handleSend(text) {
        const userMsg = {
            id: Date.now() + '-user',
            text,
            isUser: true,
            time: formatTime(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const result = await api.chat(
                text,
                hasData ? { totals } : null,
                hasData ? alerts : null
            );

            const aiMsg = {
                id: Date.now() + '-ai',
                text: result.data?.reply || 'Sorry, I couldn\'t generate a response.',
                isUser: false,
                time: formatTime(),
                audio: result.data?.audio,
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            const errMsg = {
                id: Date.now() + '-err',
                text: `Connection error: ${err.message || 'Could not reach the server. Make sure the backend is running.'}`,
                isUser: false,
                time: formatTime(),
            };
            setMessages((prev) => [...prev, errMsg]);
        }

        setIsTyping(false);
    }

    function playAudio(audioData) {
        if (!audioData?.base64) return;
        const audio = new Audio(`data:${audioData.contentType || 'audio/mpeg'};base64,${audioData.base64}`);
        audio.play();
    }

    return (
        <div className="chat-page">
            <div className="chat-header">
                <p className="chat-eyebrow">AI Assistant</p>
                <h1 className="chat-title">Chat with <em>FinPilot</em></h1>
            </div>

            <GlassCard className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className="chat-msg-wrap">
                            <ChatBubble
                                message={msg.text}
                                isUser={msg.isUser}
                                timestamp={msg.time}
                            />
                            {msg.audio?.base64 && (
                                <button
                                    className="chat-audio-btn"
                                    onClick={() => playAudio(msg.audio)}
                                >
                                    🔊 Play Audio
                                </button>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="chat-typing">
                            <div className="chat-bubble-avatar">
                                <span>FP</span>
                            </div>
                            <div className="chat-typing-dots">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input-area">
                    <ChatInput onSend={handleSend} disabled={isTyping} />
                </div>
            </GlassCard>
        </div>
    );
}
