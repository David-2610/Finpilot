/* ────────────────────────────────────────────────
   AuthContext — wallet auth state + persistence
   ──────────────────────────────────────────────── */

import { createContext, useState, useEffect, useCallback } from 'react';
import { cache } from '@/utils/cache';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [wallet, setWallet] = useState(null);
    const [signature, setSignature] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    /* ── Restore session from cache on mount ── */
    useEffect(() => {
        const savedWallet = cache.get('wallet');
        const savedSignature = cache.get('signature');
        if (savedWallet && savedSignature) {
            setWallet(savedWallet);
            setSignature(savedSignature);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    /* ── Login — save auth data ── */
    const login = useCallback((walletAddr, sig) => {
        setWallet(walletAddr);
        setSignature(sig);
        setIsAuthenticated(true);
        cache.set('wallet', walletAddr);
        cache.set('signature', sig);
        cache.set('auth_time', Date.now());
    }, []);

    /* ── Logout — clear everything ── */
    const logout = useCallback(() => {
        setWallet(null);
        setSignature(null);
        setIsAuthenticated(false);
        cache.remove('wallet');
        cache.remove('signature');
        cache.remove('auth_time');
    }, []);

    const value = {
        wallet,
        signature,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
