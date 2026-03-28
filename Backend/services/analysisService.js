// ─────────────────────────────────────────────────────
// Analysis service - categorization + alert evaluation
// ─────────────────────────────────────────────────────
const { categorizeAll } = require("../utils/categories");
const { evaluateAlerts } = require("../utils/rules");

/**
 * Analyze transactions: categorize and generate alerts
 * @param {Array} transactions - array of { description, amount, type? }
 * @returns {{ totals, categorized, alerts, summary }}
 */
function analyzeTransactions(transactions) {
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return {
      totals: {},
      categorized: [],
      alerts: [],
      summary: {
        totalTransactions: 0,
        totalSpending: 0,
        categories: 0,
      },
    };
  }

  // Categorize all transactions
  const { totals, categorized } = categorizeAll(transactions);

  // Evaluate alert rules
  const alerts = evaluateAlerts(totals);

  // Build summary
  const totalSpending = Object.values(totals).reduce((sum, val) => sum + val, 0);
  const summary = {
    totalTransactions: transactions.length,
    totalSpending,
    categories: Object.keys(totals).length,
    topCategory: Object.entries(totals).sort((a, b) => b[1] - a[1])[0] || null,
    alertCount: alerts.length,
  };

  return { totals, categorized, alerts, summary };
}

module.exports = { analyzeTransactions };
