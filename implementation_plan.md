# Connect Frontend to FinPilot Backend

## Goal

Build a complete React frontend that integrates with all FinPilot backend endpoints, delivering a premium fintech UI with dark mode, smooth animations, and full API connectivity.

## Current State

- **Backend**: Fully working on `http://localhost:5000` with 8 endpoints
- **Frontend**: Empty Vite + React + TailwindCSS v4 scaffold — only `App.jsx` (references `@/routes/AppRoutes` which doesn't exist) and `main.jsx`

---

## Proposed Changes

### 1. Configuration

#### [MODIFY] [vite.config.js](file:///c:/Users/David%20Tembhare/Desktop/Finpilot/Frontend/vite.config.js)
- Add `@vitejs/plugin-react`
- Add `@` path alias → `./src`
- Add API proxy to `http://localhost:5000` (avoids CORS issues)

#### [MODIFY] [index.html](file:///c:/Users/David%20Tembhare/Desktop/Finpilot/Frontend/index.html)
- Update title to "FinPilot — AI Financial Assistant"
- Add Inter font from Google Fonts

---

### 2. Dependencies

Install:
- `react-router-dom` — client-side routing
- `axios` — HTTP client for backend API calls
- `lucide-react` — premium icon library
- `react-hot-toast` — toast notifications
- `recharts` — charts for dashboard

---

### 3. API Service Layer

#### [NEW] `src/services/api.js`
- Axios instance with `baseURL: /api` (proxied to backend)
- Functions for every backend endpoint:
  - `getHealth()` → `GET /health`
  - `getAuthMessage()` → `GET /auth/message`
  - `verifyWallet(address, signature)` → `POST /auth/verify`
  - `storeData(transactions, wallet)` → `POST /data/store`
  - `getData(hash)` → `GET /data/:hash`
  - `analyzeTransactions(transactions)` → `POST /analyze`
  - `chat(message, data, alerts)` → `POST /chat`
  - `processAll(wallet, transactions)` → `POST /process`

---

### 4. Routing

#### [NEW] `src/routes/AppRoutes.jsx`
- `/` → LandingPage
- `/dashboard` → Dashboard
- `/upload` → Upload (transaction input)
- `/chat` → AI Chat
- `/alerts` → Alerts view

---

### 5. Pages (5 pages)

#### [NEW] `src/pages/LandingPage.jsx`
- Hero section with gradient text + CTA buttons
- Feature cards (Web3 Auth, IPFS, AI Analysis, Voice, Achievements)
- Connect Wallet button (MetaMask integration)

#### [NEW] `src/pages/UploadPage.jsx`
- Paste/enter transaction JSON or use sample data button
- Calls `POST /process` (full pipeline)
- Shows loading state, then redirects to Dashboard

#### [NEW] `src/pages/DashboardPage.jsx`
- Spending breakdown chart (Recharts pie/bar)
- Category totals cards
- AI insight panel
- Achievement badges
- IPFS hash display

#### [NEW] `src/pages/ChatPage.jsx`
- Chat interface with message bubbles
- Sends user message + context to `POST /chat`
- Displays AI reply
- Audio playback button if TTS available

#### [NEW] `src/pages/AlertsPage.jsx`
- Alert cards with severity colors (critical/warning/info)
- Advice sections
- Link to chat for follow-up

---

### 6. Shared Components

#### [NEW] `src/components/Navbar.jsx`
- Logo + nav links + wallet connect status

#### [NEW] `src/components/Layout.jsx`
- Dark background wrapper + Navbar + content slot

---

### 7. Styling

#### [MODIFY] `src/index.css`
- Tailwind v4 import + CSS custom properties for dark theme
- Inter font, gradient utilities, glassmorphism classes

---

## Verification Plan

### Automated
1. Start backend: `cd Backend && npm start`
2. Start frontend: `cd Frontend && npm run dev`
3. Browser test: Navigate all pages, test upload with sample data, verify dashboard renders, test chat

### Manual
- Visually verify premium dark theme
- Confirm all API calls reach backend and responses display correctly
