/* ────────────────────────────────────────────────
   Button — primary, secondary, ghost variants
   ──────────────────────────────────────────────── */

import './Common.css';

export default function Button({
    children,
    variant = 'primary',
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            className={`fp-btn fp-btn--${variant} ${loading ? 'fp-btn--loading' : ''} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            <span className="fp-btn-text">{children}</span>
            {loading && <span className="fp-btn-loader" />}
        </button>
    );
}
