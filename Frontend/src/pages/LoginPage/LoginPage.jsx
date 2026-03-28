/* ────────────────────────────────────────────────
   LoginPage — MetaMask auth + Web3 sign-in
   ──────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBg from '@/components/Background/AnimatedBg';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [state, setState] = useState('default'); // default | connecting | signing | success | error
    const [step, setStep] = useState(1);
    const [account, setAccount] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    function shortAddr(addr) {
        return addr ? addr.slice(0, 6) + '…' + addr.slice(-4) : '';
    }

    async function connectWallet() {
        if (typeof window.ethereum === 'undefined') {
            setErrorMsg('MetaMask not detected. Please install MetaMask.');
            setState('error');
            return;
        }

        setState('connecting');
        setStep(1);

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts?.length) {
                setErrorMsg('No accounts found.');
                setState('error');
                return;
            }
            setAccount(accounts[0]);
            setState('signing');
            setStep(2);
        } catch (err) {
            if (err.code === 4001) {
                setState('default');
                setStep(1);
            } else {
                setErrorMsg(err.message || 'Connection failed.');
                setState('error');
            }
        }
    }

    async function signMessage() {
        if (!account) return;

        const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
        const domain = window.location.host || 'finpilot.app';
        const message = [
            `${domain} wants you to sign in with your Ethereum account:`,
            account, '',
            'Sign in to FinPilot — your autonomous financial copilot.',
            '', `URI: ${window.location.origin}`,
            'Version: 1', 'Chain ID: 1',
            `Nonce: ${nonce}`,
            `Issued At: ${new Date().toISOString()}`,
        ].join('\n');

        try {
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, account],
            });

            login(account, signature);
            setState('success');
            setStep(3);
            setTimeout(() => navigate('/upload'), 1800);
        } catch (err) {
            if (err.code === 4001) {
                setState('signing');
                setStep(2);
            } else {
                setErrorMsg(err.message || 'Signing failed.');
                setState('error');
            }
        }
    }

    function reset() {
        setAccount(null);
        setState('default');
        setStep(1);
        setErrorMsg('');
    }

    /* For demo: skip MetaMask */
    function demoLogin() {
        const demoAddr = '0xDEMO' + Math.random().toString(16).slice(2, 10) + 'demo1234';
        login(demoAddr, 'demo-signature');
        setState('success');
        setStep(3);
        setTimeout(() => navigate('/upload'), 1200);
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
                        <h1 className="login-info-title">Your wallet.<br /><em>Your identity.</em></h1>
                        <p className="login-info-desc">
                            FinPilot uses Ethereum & MetaMask for zero-password, cryptographically secure login.
                            No email. No data stored. Just your wallet signature.
                        </p>
                        <div className="login-info-steps">
                            {[
                                { n: '01', name: 'Connect Wallet', hint: 'Approve the MetaMask connection request' },
                                { n: '02', name: 'Sign Message', hint: 'A one-time signature — no gas fee' },
                                { n: '03', name: 'Enter FinPilot', hint: 'Wallet address is your account' },
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
                            <span className="login-trust-pill">🔒 Non-custodial</span>
                            <span className="login-trust-pill">⛓ On-chain identity</span>
                            <span className="login-trust-pill">✓ No passwords</span>
                        </div>
                    </div>
                </aside>

                {/* RIGHT CARD */}
                <section className="login-auth-card">
                    {/* Step tracker */}
                    <div className="login-track">
                        {['Connect', 'Sign', 'Enter'].map((label, i) => (
                            <div key={label} className="login-track-group">
                                <div className={`login-track-step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
                                    <div className="login-track-dot" />
                                    <span>{label}</span>
                                </div>
                                {i < 2 && <div className={`login-track-bar ${step > i + 1 ? 'filled' : ''}`} />}
                            </div>
                        ))}
                    </div>

                    {/* STATE: Default */}
                    {state === 'default' && (
                        <div className="login-state">
                            <div className="login-fox-wrap">
                                <span className="login-fox-emoji">🦊</span>
                                <div className="login-fox-ring" />
                                <div className="login-fox-ring login-fox-ring2" />
                            </div>
                            <p className="login-state-instruction">
                                Click below to connect your MetaMask wallet.<br />
                                <span>A signature request will follow — it costs no gas.</span>
                            </p>
                            <button className="login-btn-connect" onClick={connectWallet}>
                                <span className="login-btn-icon">🦊</span>
                                <span>Connect with MetaMask</span>
                                <span className="login-btn-arrow">→</span>
                            </button>
                            <button className="login-btn-demo" onClick={demoLogin}>
                                Skip — use demo account
                            </button>
                        </div>
                    )}

                    {/* STATE: Connecting */}
                    {state === 'connecting' && (
                        <div className="login-state">
                            <div className="login-spinner">
                                <div className="login-spinner-diamond" />
                            </div>
                            <p className="login-state-label">Waiting for MetaMask…</p>
                            <p className="login-state-hint">Check the MetaMask popup in your browser</p>
                            <button className="login-btn-cancel" onClick={reset}>Cancel</button>
                        </div>
                    )}

                    {/* STATE: Signing */}
                    {state === 'signing' && (
                        <div className="login-state">
                            <div className="login-sign-anim">
                                <div className="login-sign-circle" />
                                <span className="login-sign-icon">✍</span>
                            </div>
                            <div className="login-wallet-box">
                                <span className="login-wallet-label">Connected as</span>
                                <span className="login-wallet-addr">{shortAddr(account)}</span>
                            </div>
                            <p className="login-state-label">Sign to authenticate</p>
                            <p className="login-state-hint">Approve the signature — no gas, no transaction</p>
                            <button className="login-btn-sign" onClick={signMessage}>
                                <span>Sign Message</span>
                            </button>
                            <button className="login-btn-cancel" onClick={reset}>Disconnect</button>
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
                            <p className="login-state-label login-success-text">Authenticated!</p>
                            <p className="login-state-hint">Entering FinPilot…</p>
                            <div className="login-progress-wrap">
                                <div className="login-progress-bar" />
                            </div>
                        </div>
                    )}

                    {/* STATE: Error */}
                    {state === 'error' && (
                        <div className="login-state">
                            <div className="login-error-icon">✕</div>
                            <p className="login-state-label login-error-text">{errorMsg || 'Something went wrong'}</p>
                            <p className="login-state-hint">Please try again</p>
                            <button className="login-btn-connect" onClick={reset}>
                                <span className="login-btn-icon">↺</span>
                                <span>Try Again</span>
                            </button>
                        </div>
                    )}

                    <div className="login-card-footer">
                        Powered by Ethereum · MetaMask · EIP-4361 Sign-In
                    </div>
                </section>
            </main>
        </div>
    );
}
