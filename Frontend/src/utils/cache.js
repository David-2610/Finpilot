/* ────────────────────────────────────────────────
   localStorage cache helpers
   ──────────────────────────────────────────────── */

const PREFIX = 'fp_';

export const cache = {
    get(key) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            if (!raw) return null;
            const { value, expiry } = JSON.parse(raw);
            if (expiry && Date.now() > expiry) {
                localStorage.removeItem(PREFIX + key);
                return null;
            }
            return value;
        } catch {
            return null;
        }
    },

    set(key, value, ttlMs = null) {
        try {
            const entry = { value, expiry: ttlMs ? Date.now() + ttlMs : null };
            localStorage.setItem(PREFIX + key, JSON.stringify(entry));
        } catch (e) {
            console.warn('Cache write failed:', e);
        }
    },

    remove(key) {
        localStorage.removeItem(PREFIX + key);
    },

    clear() {
        Object.keys(localStorage)
            .filter((k) => k.startsWith(PREFIX))
            .forEach((k) => localStorage.removeItem(k));
    },
};
