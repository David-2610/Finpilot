/* ────────────────────────────────────────────────
   AuthContext — email/password JWT auth + persistence
   ──────────────────────────────────────────────── */

import { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '@/services/api';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'fp_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);          // { _id, name, email, token }
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /* ── Restore session from localStorage on mount ── */
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved?.token) {
                setUser(saved);
                setIsAuthenticated(true);
            }
        } catch { /* ignore parse errors */ }
        setLoading(false);
    }, []);

    /* ── Register ── */
    const register = useCallback(async (name, email, password) => {
        setError('');
        try {
            const data = await api.registerUser(name, email, password);
            // data = { _id, name, email, token }
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Registration failed';
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    /* ── Login ── */
    const login = useCallback(async (email, password) => {
        setError('');
        try {
            const data = await api.loginUser(email, password);
            // data = { _id, name, email, token }
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Login failed';
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    /* ── Logout ── */
    const logout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        setError('');
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
