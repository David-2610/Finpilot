/* ────────────────────────────────────────────────
   AnimatedBg — gradient orbs + grid overlay
   ──────────────────────────────────────────────── */

import './AnimatedBg.css';

export default function AnimatedBg() {
    return (
        <>
            <div className="bg-canvas">
                <div className="bg-orb orb1" />
                <div className="bg-orb orb2" />
                <div className="bg-orb orb3" />
                <div className="bg-orb orb4" />
            </div>
            <div className="bg-grid" />
        </>
    );
}
