import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In an Android emulator, 10.0.2.2 maps to the host machine's localhost
const API_BASE = 'http://10.0.2.2:5000';

const client = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

/* ── Interceptor: attach Bearer token to every request ── */
client.interceptors.request.use(async (config) => {
    try {
        const raw = await AsyncStorage.getItem('fp_user');
        if (raw) {
            const user = JSON.parse(raw);
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    } catch { /* ignore */ }
    return config;
});

/* ── Interceptor: handle 401 ── */
client.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            await AsyncStorage.removeItem('fp_user');
            // Normally handled via context/navigation in mobile
        }
        return Promise.reject(err);
    }
);

export const registerUser = (name, email, password) =>
    client.post('/api/auth/register', { name, email, password }).then((r) => r.data);

export const loginUser = (email, password) =>
    client.post('/api/auth/login', { email, password }).then((r) => r.data);

export const uploadCSV = (fileUri, fileName = 'statement.csv') => {
    const formData = new FormData();
    formData.append('statement', {
        uri: fileUri,
        name: fileName,
        type: 'text/csv',
    });
    return client.post('/api/transactions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
};

export const getTransactions = () =>
    client.get('/api/transactions').then((r) => r.data);

export const getSummary = () =>
    client.get('/api/summary').then((r) => r.data);

export const getCategories = () =>
    client.get('/api/categories').then((r) => r.data);

export const getAIInsights = (summaryData) =>
    client.post('/api/ai/insights', summaryData).then((r) => r.data);

export const sendUniversalChat = (prompt) => {
    const formData = new FormData();
    if (prompt) formData.append('prompt', prompt);
    // Voice audio logic can be added here with expo-av if needed. For now, text payload.
    return client.post('/api/ai/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
};
