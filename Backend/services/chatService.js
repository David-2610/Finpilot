// ─────────────────────────────────────────────────────
// Chat service - orchestrates Gemini + prompt building
// ─────────────────────────────────────────────────────
const { askGemini } = require("./geminiService");
const { buildChatPrompt, buildInsightPrompt } = require("../utils/promptBuilder");

/**
 * Generate AI insights from financial data
 * @param {Object} totals - spending totals by category
 * @param {Array} alerts - triggered alerts
 * @returns {string} AI insight text
 */
async function generateInsight(totals, alerts) {
  const prompt = buildInsightPrompt(totals, alerts);
  return await askGemini(prompt);
}

/**
 * Generate chatbot response
 * @param {string} message - user's message
 * @param {Object} totals - spending totals
 * @param {Array} alerts - active alerts
 * @returns {string} AI reply
 */
async function generateChatReply(message, totals, alerts) {
  const prompt = buildChatPrompt(message, totals, alerts);
  return await askGemini(prompt);
}

module.exports = { generateInsight, generateChatReply };
