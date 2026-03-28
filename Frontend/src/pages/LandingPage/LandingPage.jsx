/* ────────────────────────────────────────────────
   LandingPage — hero, features, impact, how-it-works
   ──────────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import AnimatedBg from '@/components/Background/AnimatedBg';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();
    const observerRef = useRef(null);

    useEffect(() => {
        /* Scroll-triggered reveal */
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const siblings = el.parentElement.querySelectorAll('.fp-reveal');
                    const index = Array.from(siblings).indexOf(el);
                    setTimeout(() => el.classList.add('visible'), index * 100);
                    observerRef.current.unobserve(el);
                });
            },
            { threshold: 0.12 }
        );

        document.querySelectorAll('.fp-reveal').forEach((el) =>
            observerRef.current.observe(el)
        );

        return () => observerRef.current?.disconnect();
    }, []);

    /* Mouse parallax on orbs */
    useEffect(() => {
        function handleMove(e) {
            const xr = e.clientX / window.innerWidth - 0.5;
            const yr = e.clientY / window.innerHeight - 0.5;
            document.querySelectorAll('.bg-orb').forEach((orb, i) => {
                const f = (i + 1) * 0.4;
                orb.style.transform = `translate(${xr * 20 * f}px, ${yr * 20 * f}px) scale(1)`;
            });
        }
        document.addEventListener('mousemove', handleMove);
        return () => document.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <div className="landing">
            <AnimatedBg />

            {/* NAV */}
            <nav className="landing-nav">
                <div className="landing-logo" onClick={() => navigate('/')}>
                    <img src="/icons.svg" alt="FinPilot Logo" className="landing-logo-img" />
                </div>
                <div className="landing-nav-right">
                    <button className="btn-already" onClick={() => navigate('/login')}>
                        Already a user? →
                    </button>
                </div>
                <div className="landing-cta-wrap">
                    <button className="btn-primary-landing" onClick={() => navigate('/login')}>
                        <span>Get Started</span>
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="landing-hero">
                <div className="float-badge badge1"><span className="badge-dot" />693M people underserved</div>
                <div className="float-badge badge2"><span className="badge-dot" />RBI AA framework compliant</div>

                <p className="hero-eyebrow">Autonomous Finance Agent</p>
                <h1 className="hero-title">The financial manager<br />you <em>always needed</em></h1>
                <p className="hero-subtitle">Built for the financially invisible.</p>
                <p className="hero-desc">
                    FinPilot understands your bank data, detects problems before they grow,
                    and tells you exactly what to do — in plain, simple language.
                    No jargon. No confusion. Just clarity.
                </p>
                <div className="hero-cta">
                    <button className="btn-primary-landing" onClick={() => navigate('/login')}>
                        <span>Get Started</span>
                    </button>
                </div>
                <div className="stat-pills">
                    <div className="stat-pill"><div className="stat-pill-dot dot-sage" />73% of India financially illiterate</div>
                    <div className="stat-pill"><div className="stat-pill-dot dot-dusk" />89% already banked</div>
                    <div className="stat-pill"><div className="stat-pill-dot dot-gold" />Zero jargon, zero barriers</div>
                </div>
                <div className="scroll-hint">
                    <span>Explore</span>
                    <div className="scroll-line" />
                </div>
            </section>

            {/* FEATURES */}
            <section className="landing-features" id="features">
                <p className="section-label">What FinPilot does</p>
                <h2 className="section-title">Intelligence that works for <em>you</em></h2>
                <div className="features-grid">
                    {[
                        { icon: '📊', title: 'Data Inversion', desc: 'Most apps make you enter your data. FinPilot flips it — it reads and interprets your bank data for you.', accent: 'icon-sage' },
                        { icon: '🔔', title: 'Autonomous Alerts', desc: 'The Watchdog agent detects savings drops, spending spikes, and dangerous EMI ratios — before you notice.', accent: 'icon-dusk' },
                        { icon: '🗣️', title: 'Voice-First Interaction', desc: 'Speak your question in any language. FinPilot listens, reasons, and responds aloud.', accent: 'icon-gold' },
                        { icon: '👨‍👩‍👧‍👦', title: 'Family Finance Mode', desc: 'Manage household finances collectively with individual breakdowns and a single action plan.', accent: 'icon-blush' },
                        { icon: '🏦', title: 'Read-Only Bank Access', desc: 'Connected via RBI\'s Account Aggregator framework — FinPilot monitors, never moves.', accent: 'icon-sage' },
                        { icon: '🛡️', title: 'Fraud & Scheme Decoder', desc: 'Break down any policy in plain language. Hidden clauses flagged before you sign.', accent: 'icon-dusk' },
                    ].map((f) => (
                        <div className="feature-card fp-reveal" key={f.title}>
                            <div className={`feature-icon ${f.accent}`}>{f.icon}</div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="landing-divider" />

            {/* IMPACT */}
            <section className="landing-impact">
                <div className="impact-strip">
                    {[
                        { num: '693M', label: 'financially illiterate adults in India' },
                        { num: '126', label: 'financial institutions on RBI AA framework' },
                        { num: '₹0', label: 'marginal cost per user — pure software' },
                        { num: '35%', label: 'of Jan Dhan accounts remain inactive' },
                    ].map((item) => (
                        <div className="impact-item fp-reveal" key={item.num}>
                            <div className="impact-num">{item.num}</div>
                            <div className="impact-label">{item.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="landing-how">
                <p className="section-label center">How it works</p>
                <h2 className="section-title">Three steps to financial clarity</h2>
                <div className="steps-row">
                    {[
                        { num: '01', title: 'Upload Your Statement', desc: 'Share your PDF or CSV bank statement. FinPilot parses it securely — no external API calls.' },
                        { num: '02', title: 'Agent Analyses & Alerts', desc: 'The Profiler builds your financial profile. The Watchdog scans for anomalies autonomously.' },
                        { num: '03', title: 'Ask or Just Listen', desc: 'Get a clear, reasoned answer using your actual money data — not generic advice.' },
                    ].map((s) => (
                        <div className="step fp-reveal" key={s.num}>
                            <div className="step-num">{s.num}</div>
                            <h4 className="step-title">{s.title}</h4>
                            <p className="step-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="landing-divider" />

            {/* FOOTER CTA */}
            <section className="landing-footer-cta">
                <h2 className="footer-title">Your money,<br /><em>finally understood.</em></h2>
                <p className="footer-sub">No financial literacy required. No jargon. No guesswork. Just FinPilot — working for you, always.</p>
                <button className="btn-primary-landing" onClick={() => navigate('/login')}>
                    <span>Get Started Free</span>
                </button>
                <p className="footer-note">Built by Xpointers · JKIAPT, University of Allahabad · Stellaris 2026</p>
            </section>
        </div>
    );
}
