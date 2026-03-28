/* ────────────────────────────────────────────────
   ChatInput — message input with send button
   ──────────────────────────────────────────────── */

import { useState } from 'react';
import './Chat.css';

export default function ChatInput({ onSend, disabled = false, placeholder = 'Ask FinPilot anything…' }) {
    const [text, setText] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const msg = text.trim();
        if (!msg || disabled) return;
        onSend(msg);
        setText('');
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="chat-input-field"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
            />
            <button
                type="submit"
                className="chat-input-send"
                disabled={disabled || !text.trim()}
            >
                <span>→</span>
            </button>
        </form>
    );
}
