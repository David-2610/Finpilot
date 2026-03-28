/* ────────────────────────────────────────────────
   ChatBubble — single message bubble
   ──────────────────────────────────────────────── */

import './Chat.css';

export default function ChatBubble({ message, isUser = false, timestamp }) {
    return (
        <div className={`chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--ai'}`}>
            {!isUser && (
                <div className="chat-bubble-avatar">
                    <span>FP</span>
                </div>
            )}
            <div className="chat-bubble-body">
                <div className="chat-bubble-content">{message}</div>
                {timestamp && (
                    <div className="chat-bubble-time">{timestamp}</div>
                )}
            </div>
        </div>
    );
}
