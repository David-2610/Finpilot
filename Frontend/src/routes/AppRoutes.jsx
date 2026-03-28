/* ────────────────────────────────────────────────
   AppRoutes — application routing config
   ──────────────────────────────────────────────── */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import LandingPage from '@/pages/LandingPage/LandingPage';
import LoginPage from '@/pages/LoginPage/LoginPage';
import UploadPage from '@/pages/UploadPage/UploadPage';
import DashboardPage from '@/pages/DashboardPage/DashboardPage';
import ChatPage from '@/pages/ChatPage/ChatPage';
import AlertsPage from '@/pages/AlertsPage/AlertsPage';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing page — full screen, no sidebar */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* App pages — with sidebar layout */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
