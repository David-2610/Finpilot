import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'fp_';

export const cache = {
    async get(key) {
        try {
            const raw = await AsyncStorage.getItem(PREFIX + key);
            if (!raw) return null;
            const { value, expiry } = JSON.parse(raw);
            if (expiry && Date.now() > expiry) {
                await AsyncStorage.removeItem(PREFIX + key);
                return null;
            }
            return value;
        } catch {
            return null;
        }
    },

    async set(key, value, ttlMs = null) {
        try {
            const entry = { value, expiry: ttlMs ? Date.now() + ttlMs : null };
            await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
        } catch (e) {
            console.warn('Cache write failed:', e);
        }
    },

    async remove(key) {
        await AsyncStorage.removeItem(PREFIX + key);
    },

    async clear() {
        const keys = await AsyncStorage.getAllKeys();
        const appKeys = keys.filter((k) => k.startsWith(PREFIX));
        if (appKeys.length > 0) {
            await AsyncStorage.multiRemove(appKeys);
        }
    },
};
