/* ────────────────────────────────────────────────
   Sidebar — floating glassmorphism nav
   ──────────────────────────────────────────────── */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NAV_LINKS } from '@/utils/constants';
import './Sidebar.css';

export default function Sidebar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo" onClick={() => navigate('/')}>
                <img src="/icons.svg" alt="FinPilot Logo" className="sidebar-logo-img" />
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

            {/* User Status */}
            <div className="sidebar-footer">
                {isAuthenticated && user ? (
                    <div className="sidebar-wallet">
                        <div className="wallet-status">
                            <span className="wallet-dot" />
                            <div className="sidebar-user-info">
                                <span className="sidebar-user-name">{user.name}</span>
                                <span className="sidebar-user-email">{user.email}</span>
                            </div>
                        </div>
                        <button className="sidebar-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        className="sidebar-connect"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </aside>
    );
}
