/* ────────────────────────────────────────────────
   Sidebar — floating glassmorphism nav
   ──────────────────────────────────────────────── */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NAV_LINKS } from '@/utils/constants';
import './Sidebar.css';

export default function Sidebar() {
    const { wallet, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    function shortAddress(addr) {
        if (!addr) return '';
        return addr.slice(0, 6) + '…' + addr.slice(-4);
    }

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo" onClick={() => navigate('/')}>
                <div className="sidebar-logo-dot" />
                <span>FinPilot</span>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {NAV_LINKS.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{link.icon}</span>
                        <span className="sidebar-link-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Wallet Status */}
            <div className="sidebar-footer">
                {isAuthenticated && wallet ? (
                    <div className="sidebar-wallet">
                        <div className="wallet-status">
                            <span className="wallet-dot" />
                            <span className="wallet-addr">{shortAddress(wallet)}</span>
                        </div>
                        <button className="sidebar-logout" onClick={handleLogout}>
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        className="sidebar-connect"
                        onClick={() => navigate('/login')}
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </aside>
    );
}
