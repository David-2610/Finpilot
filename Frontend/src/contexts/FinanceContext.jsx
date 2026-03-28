/* ────────────────────────────────────────────────
   FinanceContext — transactions, analysis, AI data
   ──────────────────────────────────────────────── */

import { createContext, useState, useEffect, useCallback } from 'react';
import { cache } from '@/utils/cache';
import * as api from '@/services/api';

export const FinanceContext = createContext(null);

const CACHE_KEY = 'finance_data';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export function FinanceProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [totals, setTotals] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [aiInsight, setAiInsight] = useState('');
    const [reply, setReply] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');
    const [achievements, setAchievements] = useState(null);
    const [audio, setAudio] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [hasData, setHasData] = useState(false);

    /* ── Restore from cache on mount ── */
    useEffect(() => {
        const saved = cache.get(CACHE_KEY);
        if (saved) {
            restoreData(saved);
        }
    }, []);

    function restoreData(data) {
        setTransactions(data.transactions || []);
        setTotals(data.totals || {});
        setAlerts(data.alerts || []);
        setSummary(data.summary || null);
        setAiInsight(data.aiInsight || '');
        setReply(data.reply || '');
        setIpfsHash(data.ipfsHash || '');
        setAchievements(data.achievements || null);
        setAudio(data.audio || null);
        setHasData(true);
    }

    function cacheData(data) {
        cache.set(CACHE_KEY, data, CACHE_TTL);
    }

    /* ── Process transactions — full pipeline ── */
    const processTransactions = useCallback(async (txns, wallet = 'anonymous') => {
        setProcessing(true);
        try {
            const result = await api.processAll(wallet, txns);
            const d = result.data;

            const financeData = {
                transactions: txns,
                totals: d.totals,
                alerts: d.alerts,
                summary: d.summary,
                aiInsight: d.ai_insight,
                reply: d.reply,
                ipfsHash: d.ipfs?.hash || '',
                achievements: d.achievements,
                audio: d.audio,
            };

            restoreData(financeData);
            cacheData(financeData);
            setProcessing(false);
            return result;
        } catch (err) {
            setProcessing(false);
            throw err;
        }
    }, []);

    /* ── Clear all data ── */
    const clearData = useCallback(() => {
        setTransactions([]);
        setTotals({});
        setAlerts([]);
        setSummary(null);
        setAiInsight('');
        setReply('');
        setIpfsHash('');
        setAchievements(null);
        setAudio(null);
        setHasData(false);
        cache.remove(CACHE_KEY);
    }, []);

    const value = {
        transactions,
        totals,
        alerts,
        summary,
        aiInsight,
        reply,
        ipfsHash,
        achievements,
        audio,
        processing,
        hasData,
        processTransactions,
        clearData,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}
