// ─────────────────────────────────────────────────────
// Prompt builder for Gemini AI interactions
// ─────────────────────────────────────────────────────

/**
 * Build an insight generation prompt from financial data
 * @param {Object} totals - spending totals by category
 * @param {Array} alerts - triggered alerts
 * @returns {string} formatted prompt
 */
function buildInsightPrompt(totals, alerts) {
  const totalsStr = Object.entries(totals)
    .map(([cat, amt]) => `  - ${cat}: ₹${amt.toLocaleString("en-IN")}`)
    .join("\n");

  const alertsStr = alerts.length > 0
    ? alerts.map((a) => `  - [${a.severity.toUpperCase()}] ${a.message}`).join("\n")
    : "  - No alerts triggered.";

  return `You are FinPilot, an AI-powered financial advisor. Analyze the following user financial data and provide clear, actionable insights.

## User's Spending Breakdown:
${totalsStr}

## Triggered Alerts:
${alertsStr}

## Instructions:
1. Identify the top 3 areas where the user can save money.
2. Provide specific, actionable advice for each area.
3. Give an overall financial health score (1-10).
4. Keep your response concise (under 200 words).
5. Use a friendly, supportive tone.
6. Format with bullet points for readability.`;
}

/**
 * Build a chatbot response prompt
 * @param {string} userMessage - user's question or message
 * @param {Object} totals - spending totals by category
 * @param {Array} alerts - triggered alerts
 * @returns {string} formatted prompt
 */
function buildChatPrompt(userMessage, totals, alerts) {
  const totalsStr = Object.entries(totals || {})
    .map(([cat, amt]) => `  - ${cat}: ₹${amt}`)
    .join("\n");

  const alertsStr = (alerts || []).length > 0
    ? alerts.map((a) => `  - ${a.message}`).join("\n")
    : "  - No active alerts.";

  return `You are FinPilot, an AI financial advisor chatbot. You give short, actionable, friendly advice.

## User's Financial Context:
${totalsStr || "  - No spending data provided."}

## Active Alerts:
${alertsStr}

## User's Message:
"${userMessage}"

## Instructions:
- Give a direct, helpful response in 2-3 sentences max.
- Reference the user's actual spending data when relevant.
- Be specific with numbers and actionable suggestions.
- Use a warm, encouraging tone.`;
}

module.exports = { buildInsightPrompt, buildChatPrompt };
