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
            setAiInsight(data.advice || '');
            return data.advice;
        } catch (err) {
            console.error('Failed to fetch AI insights:', err);
            throw err;
        }
    }, [summary]);

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
        loadDashboardData,
        clearData,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}
