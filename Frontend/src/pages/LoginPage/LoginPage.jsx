/* ────────────────────────────────────────────────
   LoginPage — email/password auth with register toggle
   ──────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBg from '@/components/Background/AnimatedBg';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, setState] = useState('default'); // default | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg('');
        setState('loading');

        try {
            if (isRegister) {
                if (!name.trim()) {
                    setErrorMsg('Name is required');
                    setState('error');
                    return;
                }
                await register(name, email, password);
            } else {
                await login(email, password);
            }
            setState('success');
            setTimeout(() => navigate('/dashboard'), 1200);
        } catch (err) {
            setErrorMsg(err.message || 'Something went wrong');
            setState('error');
        }
    }

    function reset() {
        setState('default');
        setErrorMsg('');
    }

    function toggleMode() {
        setIsRegister(!isRegister);
        setErrorMsg('');
        setState('default');
    }

    return (
        <div className="login-page">
            <AnimatedBg />

            <button className="login-back" onClick={() => navigate('/')}>← Back to home</button>

            <main className="login-wrapper">
                {/* LEFT PANEL */}
                <aside className="login-info-panel">
                    <div className="login-info-inner">
                        <div className="login-logo">
                            <div className="login-logo-dot" />
                            FinPilot
                        </div>
                        <h1 className="login-info-title">Your finances.<br /><em>Simplified.</em></h1>
                        <p className="login-info-desc">
                            FinPilot analyzes your bank statements, categorizes transactions automatically,
                            and gives you AI-powered financial advice — all in one place.
                        </p>
                        <div className="login-info-steps">
                            {[
                                { n: '01', name: 'Create Account', hint: 'Sign up with your email and password' },
                                { n: '02', name: 'Upload Statement', hint: 'Upload your bank CSV statement' },
                                { n: '03', name: 'Get Insights', hint: 'AI analyzes your spending patterns' },
                            ].map((s, i) => (
                                <div key={s.n}>
                                    <div className="login-step-item">
                                        <div className="login-step-badge">{s.n}</div>
                                        <div>
                                            <p className="login-step-name">{s.name}</p>
                                            <p className="login-step-hint">{s.hint}</p>
                                        </div>
                                    </div>
                                    {i < 2 && <div className="login-step-connector" />}
                                </div>
                            ))}
                        </div>
                        <div className="login-trust-pills">
                            <span className="login-trust-pill">🔒 Secure JWT Auth</span>
                            <span className="login-trust-pill">🤖 AI-Powered</span>
                            <span className="login-trust-pill">📊 Smart Analysis</span>
                        </div>
                    </div>
                </aside>

                {/* RIGHT CARD */}
                <section className="login-auth-card">
                    {/* Tab toggle */}
                    <div className="login-tabs">
                        <button
                            className={`login-tab ${!isRegister ? 'login-tab--active' : ''}`}
                            onClick={() => { setIsRegister(false); reset(); }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`login-tab ${isRegister ? 'login-tab--active' : ''}`}
                            onClick={() => { setIsRegister(true); reset(); }}
                        >
                            Register
                        </button>
                    </div>

                    {/* STATE: Default / Error form */}
                    {(state === 'default' || state === 'error') && (
                        <div className="login-state">
                            <div className="login-form-icon-wrap">
                                <span className="login-form-icon">{isRegister ? '✨' : '👤'}</span>
                                <div className="login-fox-ring" />
                            </div>

                            <p className="login-state-instruction">
                                {isRegister
                                    ? 'Create your FinPilot account to start managing your finances.'
                                    : 'Welcome back! Sign in to access your financial dashboard.'
                                }
                            </p>

                            <form className="login-form" onSubmit={handleSubmit}>
                                {isRegister && (
                                    <div className="login-field">
                                        <label className="login-label">Full Name</label>
                                        <input
                                            className="login-input"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="login-field">
                                    <label className="login-label">Email</label>
                                    <input
                                        className="login-input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div className="login-field">
                                    <label className="login-label">Password</label>
                                    <input
                                        className="login-input"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {errorMsg && (
                                    <p className="login-form-error">{errorMsg}</p>
                                )}

                                <button className="login-btn-submit" type="submit">
                                    <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                                    <span className="login-btn-arrow">→</span>
                                </button>
                            </form>

                            <button className="login-btn-demo" onClick={toggleMode}>
                                {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                            </button>
                        </div>
                    )}

                    {/* STATE: Loading */}
                    {state === 'loading' && (
                        <div className="login-state">
                            <div className="login-spinner">
                                <div className="login-spinner-diamond" />
                            </div>
                            <p className="login-state-label">{isRegister ? 'Creating account…' : 'Signing in…'}</p>
                            <p className="login-state-hint">Please wait a moment</p>
                        </div>
                    )}

                    {/* STATE: Success */}
                    {state === 'success' && (
                        <div className="login-state">
                            <div className="login-success-wrap">
                                <div className="login-success-circle">
                                    <span className="login-success-check">✓</span>
                                </div>
                            </div>
                            <p className="login-state-label login-success-text">
                                {isRegister ? 'Account Created!' : 'Welcome Back!'}
                            </p>
                            <p className="login-state-hint">Entering FinPilot…</p>
                            <div className="login-progress-wrap">
                                <div className="login-progress-bar" />
                            </div>
                        </div>
                    )}

                    <div className="login-card-footer">
                        Secured by JWT · FinPilot · AI-Powered Finance
                    </div>
                </section>
            </main>
        </div>
    );
}
