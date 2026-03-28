import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'fp_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadSession = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed?.token) {
                        setUser(parsed);
                        setIsAuthenticated(true);
                    }
                }
            } catch { /* ignore */ }
            setLoading(false);
        };
        loadSession();
    }, []);

    const register = useCallback(async (name, email, password) => {
        setError('');
        try {
            const data = await api.registerUser(name, email, password);
            setUser(data);
            setIsAuthenticated(true);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Registration failed';
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setError('');
        try {
            const data = await api.loginUser(email, password);
            setUser(data);
            setIsAuthenticated(true);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Login failed';
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        setIsAuthenticated(false);
        setError('');
        await AsyncStorage.removeItem(STORAGE_KEY);
    }, []);

    const value = { user, isAuthenticated, loading, error, register, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
