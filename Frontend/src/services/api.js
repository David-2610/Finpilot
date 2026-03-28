/* ────────────────────────────────────────────────
   API service layer — all backend endpoint calls
   ──────────────────────────────────────────────── */

import axios from 'axios';
import { API_BASE } from '@/utils/constants';

const client = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

/* ─── Health ─── */
export const getHealth = () =>
    client.get('/health').then((r) => r.data);

/* ─── Auth ─── */
export const getAuthMessage = () =>
    client.get('/auth/message').then((r) => r.data);

export const verifyWallet = (address, signature) =>
    client.post('/auth/verify', { address, signature }).then((r) => r.data);

/* ─── Data / IPFS ─── */
export const storeData = (transactions, wallet) =>
    client.post('/data/store', { transactions, wallet }).then((r) => r.data);

export const getData = (hash) =>
    client.get(`/data/${hash}`).then((r) => r.data);

/* ─── Analysis ─── */
export const analyzeTransactions = (transactions) =>
    client.post('/analyze', { transactions }).then((r) => r.data);

/* ─── Chat ─── */
export const chat = (message, data = null, alerts = null) =>
    client.post('/chat', { message, data, alerts }).then((r) => r.data);

/* ─── Full pipeline ─── */
export const processAll = (wallet, transactions) =>
    client.post('/process', { wallet, transactions }).then((r) => r.data);
