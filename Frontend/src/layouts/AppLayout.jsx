/* ────────────────────────────────────────────────
   AppLayout — Sidebar + Background + Content
   ──────────────────────────────────────────────── */

import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import AnimatedBg from '@/components/Background/AnimatedBg';
import './AppLayout.css';

export default function AppLayout() {
    return (
        <div className="app-layout">
            <AnimatedBg />
            <Sidebar />
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
}
