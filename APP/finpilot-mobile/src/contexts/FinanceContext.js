import React, { createContext, useState, useCallback } from 'react';
import * as api from '../services/api';
import * as Speech from 'expo-speech';

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState(null);
    const [aiInsight, setAiInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasData, setHasData] = useState(false);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getTransactions();
            setTransactions(data);
            setHasData(data.length > 0);
            return data;
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSummary = useCallback(async () => {
        try {
            const data = await api.getSummary();
            setSummary(data);
            if (data.totalIncome > 0 || data.totalExpenses > 0) setHasData(true);
            return data;
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
            return data;
        } catch (err) {
            console.error(err);
        }
    }, []);

    const uploadCSV = useCallback(async (fileUri, fileName) => {
        setLoading(true);
        try {
            const data = await api.uploadCSV(fileUri, fileName);
            await Promise.all([fetchTransactions(), fetchSummary(), fetchCategories()]);
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTransactions, fetchSummary, fetchCategories]);

    const fetchAIInsights = useCallback(async (summaryData) => {
        try {
            const data = await api.getAIInsights(summaryData || summary);
            const advice = data.advice || '';
            if (advice) {
                Speech.stop();
                Speech.speak(advice, { rate: 1.1 });
            }
            setAiInsight(advice);
            return advice;
        } catch (err) {
            console.error(err);
        }
    }, [summary]);

    const fetchChat = useCallback(async (prompt) => {
        try {
            const data = await api.sendUniversalChat(prompt);
            if (data.text) {
                Speech.stop();
                Speech.speak(data.text, { rate: 1.1 });
            }
            setAiInsight(data.text || '');
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, []);

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
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    const clearData = useCallback(() => {
        setTransactions([]);
        setCategories([]);
        setSummary(null);
        setAiInsight('');
        setHasData(false);
    }, []);

    const stopVoice = useCallback(() => {
        Speech.stop();
    }, []);

    const value = {
        transactions, categories, summary, aiInsight, loading, hasData,
        fetchTransactions, fetchSummary, fetchCategories, uploadCSV, fetchAIInsights, fetchChat, loadDashboardData, clearData, stopVoice
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}
