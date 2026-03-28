/* ────────────────────────────────────────────────
   Loader — spinner and progress states
   ──────────────────────────────────────────────── */

import './Common.css';

export default function Loader({ text = 'Loading…', progress = null }) {
    return (
        <div className="fp-loader">
            <div className="fp-loader-ring">
                <svg className="fp-loader-svg" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" />
                </svg>
                <div className="fp-loader-center">FP</div>
            </div>
            {progress !== null && (
                <div className="fp-loader-progress">
                    <div className="fp-loader-progress-bar" style={{ width: `${progress}%` }} />
                </div>
            )}
            <p className="fp-loader-text">{text}</p>
        </div>
    );
}
