// ─────────────────────────────────────────────────────
// Analyze route - transaction categorization + alerts
// ─────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { analyzeTransactions } = require("../services/analysisService");

/**
 * POST /analyze
 * Categorizes transactions and generates alerts
 * Body: { transactions: Array }
 */
router.post("/", (req, res) => {
  const { transactions } = req.body;

  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({
      success: false,
      error: "Missing or invalid 'transactions' array. Expected: [{ description: string, amount: number }]",
    });
  }

  const result = analyzeTransactions(transactions);

  res.json({
    success: true,
    message: "📊 Analysis complete",
    data: {
      totals: result.totals,
      alerts: result.alerts,
      summary: result.summary,
      categorized: result.categorized,
    },
  });
});

module.exports = router;
