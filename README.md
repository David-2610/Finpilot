# 🌌 FinPilot: Autonomous AI Finance Mentor

FinPilot is a premium, high-performance financial management platform that combines autonomous transaction tracking with a native AI voice-to-voice conversational interface. Powered by Google Gemini, it provides "Financial Grounding" through its mentor persona, **Gravity**.

---

## 🚀 Key Features

### 🎙️ AI Voice-to-Voice Mentor (Gravity)
- **High-Performance Mentorship**: Interact with "Gravity," a futuristic AI personality that analyzes your spending in real-time.
- **Direct Voice Input**: Record your queries directly in the browser for hands-free financial advice.
- **Native TTS**: Uses advanced browser speech synthesis with a custom pulsing visualizer and markdown-formatted responses.

### 📋 Smart Transaction Registry
- **Bulk Categorization**: Update a single transaction's category, and FinPilot's smart script automatically updates all transactions from that merchant globally.
- **Custom Category Creation**: Add and apply new categories on-the-fly directly from the registry modal.
- **Detailed Tracking**: See raw bank descriptions, extracted merchant names, and payment modes (UPI, IMPS, NEFT) in a sleek, tabular format.

### 📊 Dynamic Financial Dashboard
- **Glassmorphism UI**: A premium, state-of-the-art interface with smooth gradients and micro-animations.
- **Manual AI Insights**: On-demand deep-dive analysis of your spending habits with the "Generate Insights" control.
- **Live Summaries**: Real-time updates to your income, expenses, and savings rate as you categorize data.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Vanilla CSS (Premium Styling), React Markdown.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI Engine**: Google Gemini (Flash-Lite / Pro) for processing text and audio.
- **Voice Engine**: Web Speech API (SpeechSynthesis) & MediaRecorder API.

---

## 💻 Local Installation & Setup

Follow these steps to get FinPilot running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance.
- [Google Gemini API Key](https://aistudio.google.com/app/apikey).

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Finpilot
```

### 2. Backend Configuration
1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory and add your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the Frontend folder (from the root):
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_BASE=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 📝 Demo Instructions

We have provided a sample dataset to help you explore FinPilot's capabilities:

1. Locate the `demo_sbi_statement.csv` file in the project root.
2. Sign in to the app (create a free account).
3. Navigate to **Upload** and drop the `demo_sbi_statement.csv` file.
4. Go to **Transactions** to try out the **Bulk Categorization** feature.
5. Go to the **Chat** page to speak with **Gravity** about your new data!

---

## 🛡️ Operational Protocol (Gravity AI)

Gravity operates on a strict mentorship protocol:
- **Direct Answer**: Concise, data-driven responses to your queries.
- **Current Orbit**: A multi-line status check on your budget trajectory.
- **Gravity Insight**: Proactive identification of "spending leaks" or optimization opportunities.

---

## 📄 License
This project is licensed under the MIT License.