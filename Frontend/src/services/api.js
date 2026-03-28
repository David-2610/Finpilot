/* ────────────────────────────────────────────────
   API service layer — all backend endpoint calls
   ──────────────────────────────────────────────── */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const client = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

/* ── Interceptor: attach Bearer token to every request ── */
client.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('fp_user') || 'null');
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

/* ── Interceptor: handle 401 → clear auth ── */
client.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('fp_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

/* ─── Auth ─── */
export const registerUser = (name, email, password) =>
    client.post('/api/auth/register', { name, email, password }).then((r) => r.data);

export const loginUser = (email, password) =>
    client.post('/api/auth/login', { email, password }).then((r) => r.data);

/* ─── Transactions ─── */
export const uploadCSV = (file) => {
    const formData = new FormData();
    formData.append('statement', file);
    return client.post('/api/transactions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
};

export const getTransactions = () =>
    client.get('/api/transactions').then((r) => r.data);

export const updateTransaction = (id, data) =>
    client.patch(`/api/transactions/${id}`, data).then((r) => r.data);

/* ─── Categories ─── */
export const getCategories = () =>
    client.get('/api/categories').then((r) => r.data);

export const createCategory = (name, icon) =>
    client.post('/api/categories', { name, icon }).then((r) => r.data);

export const deleteCategory = (id) =>
    client.delete(`/api/categories/${id}`).then((r) => r.data);

/* ─── Summary ─── */
export const getSummary = () =>
    client.get('/api/summary').then((r) => r.data);

/* ─── AI Insights ─── */
export const getAIInsights = (summaryData) =>
    client.post('/api/ai/insights', summaryData).then((r) => r.data);
