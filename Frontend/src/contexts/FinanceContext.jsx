/* ────────────────────────────────────────────────
   FinanceContext — transactions, summary, categories, AI
   ──────────────────────────────────────────────── */

import { createContext, useState, useCallback } from 'react';
import * as api from '@/services/api';

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState(null);   // { totalIncome, totalExpenses, categoryBreakdown }
    const [aiInsight, setAiInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasData, setHasData] = useState(false);

    /* ── Fetch transactions ── */
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getTransactions();
            setTransactions(data);
            setHasData(data.length > 0);
            return data;
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Fetch summary ── */
    const fetchSummary = useCallback(async () => {
        try {
            const data = await api.getSummary();
            setSummary(data);
            if (data.totalIncome > 0 || data.totalExpenses > 0) {
                setHasData(true);
            }
            return data;
        } catch (err) {
            console.error('Failed to fetch summary:', err);
            throw err;
        }
    }, []);

    /* ── Fetch categories ── */
    const fetchCategories = useCallback(async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
            return data;
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            throw err;
        }
    }, []);

    /* ── Upload CSV ── */
    const uploadCSV = useCallback(async (file) => {
        setLoading(true);
        try {
            const data = await api.uploadCSV(file);
            // After upload, refresh transactions and summary
            await Promise.all([fetchTransactions(), fetchSummary(), fetchCategories()]);
            return data;
        } catch (err) {
            console.error('Failed to upload CSV:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTransactions, fetchSummary, fetchCategories]);

    /* ── Fetch AI insights ── */
    const fetchAIInsights = useCallback(async (summaryData) => {
        try {
            const data = await api.getAIInsights(summaryData || summary);
            const advice = data.advice || '';
            
            // Auto-speak on first arrival
            if (advice) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(advice);
                utterance.rate = 1.1;
                window.speechSynthesis.speak(utterance);
            }

            setAiInsight(advice);
            return advice;
        } catch (err) {
            console.error('Failed to fetch AI insights:', err);
            throw err;
        }
    }, [summary]);

    /* ── Universal Chat (Text or Voice) ── */
    const fetchChat = useCallback(async (prompt, audioBlob) => {
        try {
            const data = await api.sendUniversalChat(prompt, audioBlob);
            
            // USE BROWSER NATIVE TTS (No Sign-in, No Cost, Stops properly)
            if (data.text) {
                // 1. Stop any currently playing speech
                window.speechSynthesis.cancel();

                // 2. Start new speech
                const utterance = new SpeechSynthesisUtterance(data.text);
                
                // Configure voice properties
                utterance.pitch = 1.0;
                utterance.rate = 1.1; // Slightly faster for natural flow
                utterance.volume = 1.0;
                
                // Optional: Pick a better voice if available
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
                if (preferredVoice) utterance.voice = preferredVoice;

                window.speechSynthesis.speak(utterance);
            }

            setAiInsight(data.text || '');
            return data;
        } catch (err) {
            console.error('Chat failed:', err);
            throw err;
        }
    }, []);

    /* ── Load all dashboard data ── */
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [txns, sum, cats] = await Promise.all([
                api.getTransactions(),
                api.getSummary(),
                api.getCategories(),
            ]);
            setTransactions(txns);
            setSummary(sum);
            setCategories(cats);
            setHasData(txns.length > 0);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Clear all data ── */
    const clearData = useCallback(() => {
        setTransactions([]);
        setCategories([]);
        setSummary(null);
        setAiInsight('');
        setHasData(false);
    }, []);

    /* ── Stop Speech Synthesis ── */
    const stopVoice = useCallback(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    const value = {
        transactions,
        categories,
        summary,
        aiInsight,
        loading,
        hasData,
        fetchTransactions,
        fetchSummary,
        fetchCategories,
        uploadCSV,
        fetchAIInsights,
        fetchChat,
        loadDashboardData,
        clearData,
        stopVoice,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}
