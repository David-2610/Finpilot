// ─────────────────────────────────────────────────────
// FinPilot Backend - AI Financial Assistant
// ─────────────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

// Import routes
const authRoute = require("./routes/auth");
const dataRoute = require("./routes/data");
const analyzeRoute = require("./routes/analyze");
const chatRoute = require("./routes/chat");
const processRoute = require("./routes/process");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Health Check ─────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "running",
    service: "FinPilot Backend",
    version: "1.0.0",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET  /health",
      "GET  /auth/message",
      "POST /auth/verify",
      "POST /data/store",
      "GET  /data/:hash",
      "POST /analyze",
      "POST /chat",
      "POST /process",
    ],
  });
});

// ── Root ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 FinPilot Backend is running!",
    docs: "GET /health for available endpoints",
  });
});

// ── Routes ───────────────────────────────────────────
app.use("/auth", authRoute);
app.use("/data", dataRoute);
app.use("/analyze", analyzeRoute);
app.use("/chat", chatRoute);
app.use("/process", processRoute);

// ── 404 Handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    hint: "GET /health for available endpoints",
  });
});

// ── Error Handler ────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║   🚀 FinPilot Backend v1.0.0            ║
║   ────────────────────────────           ║
║   Port: ${PORT}                            ║
║   Status: Running                        ║
║   Health: http://localhost:${PORT}/health   ║
║                                          ║
╚══════════════════════════════════════════╝
  `);
});

module.exports = app;