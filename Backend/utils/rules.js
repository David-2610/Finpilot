// ─────────────────────────────────────────────────────
// Alert rules engine for financial health monitoring
// ─────────────────────────────────────────────────────

const alertRules = [
  {
    id: "high_food",
    category: "food",
    threshold: 4000,
    severity: "warning",
    message: "🍕 High food spending detected! You've spent over ₹4,000 on food.",
    advice: "Consider meal prepping or reducing food delivery orders.",
  },
  {
    id: "high_subscriptions",
    category: "subscriptions",
    threshold: 1000,
    severity: "warning",
    message: "📺 Too many subscriptions! Spending over ₹1,000 on subscriptions.",
    advice: "Review your subscriptions and cancel ones you rarely use.",
  },
  {
    id: "high_transport",
    category: "transport",
    threshold: 3000,
    severity: "info",
    message: "🚗 Transport expenses are above ₹3,000.",
    advice: "Consider carpooling or using public transport more often.",
  },
  {
    id: "high_shopping",
    category: "shopping",
    threshold: 5000,
    severity: "warning",
    message: "🛍️ Shopping expenses exceeded ₹5,000.",
    advice: "Track impulse purchases and set a monthly shopping budget.",
  },
  {
    id: "high_entertainment",
    category: "entertainment",
    threshold: 2000,
    severity: "info",
    message: "🎬 Entertainment spending is above ₹2,000.",
    advice: "Look for free activities or discount deals for entertainment.",
  },
  {
    id: "low_savings",
    category: "savings",
    threshold: 2000,
    operator: "less_than",
    severity: "critical",
    message: "⚠️ Low savings detected! Your savings are below ₹2,000.",
    advice: "Prioritize building an emergency fund. Aim to save at least 20% of income.",
  },
];

/**
 * Evaluate alert rules against categorized totals
 * @param {Object} totals - { category: totalAmount }
 * @returns {Array} triggered alerts
 */
function evaluateAlerts(totals) {
  const alerts = [];

  for (const rule of alertRules) {
    const amount = totals[rule.category] || 0;

    if (rule.operator === "less_than") {
      // Trigger if amount is less than threshold (e.g., low savings)
      if (amount < rule.threshold) {
        alerts.push({
          id: rule.id,
          severity: rule.severity,
          message: rule.message,
          advice: rule.advice,
          category: rule.category,
          amount,
          threshold: rule.threshold,
        });
      }
    } else {
      // Default: trigger if amount exceeds threshold
      if (amount > rule.threshold) {
        alerts.push({
          id: rule.id,
          severity: rule.severity,
          message: rule.message,
          advice: rule.advice,
          category: rule.category,
          amount,
          threshold: rule.threshold,
        });
      }
    }
  }

  return alerts;
}

module.exports = { evaluateAlerts, alertRules };
