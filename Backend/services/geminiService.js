// ─────────────────────────────────────────────────────
// Gemini AI service (Google Gemini Flash 2.5)
// ─────────────────────────────────────────────────────
require("dotenv").config();
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Send a prompt to Gemini and get a response
 * @param {string} prompt - the full prompt text
 * @returns {string} AI response text
 */
async function askGemini(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_key") {
    console.warn("⚠️ Gemini API key not set, returning mock response");
    return getMockResponse(prompt);
  }

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn("⚠️ Empty response from Gemini");
      return getMockResponse(prompt);
    }

    return text;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return getMockResponse(prompt);
  }
}

/**
 * Generate a mock response when API is unavailable
 */
function getMockResponse(prompt) {
  if (prompt.includes("Analyze") || prompt.includes("insights")) {
    return `📊 **FinPilot Financial Insights**

• **Top Savings Opportunity:** Your food spending is your largest expense category. Consider meal prepping 2-3 days a week to cut costs by 30-40%.

• **Subscription Audit:** Review your active subscriptions — many users save ₹500-1,000/month by cancelling unused services.

• **Smart Transport:** If transport costs are high, try combining trips or using public transit for short distances.

**Overall Financial Health Score: 6/10**
You're doing okay, but there's room to optimize. Focus on building a 3-month emergency fund as your next milestone. 💪`;
  }

  return `💡 Great question! Based on your spending data, I'd recommend focusing on your largest expense category first. Small changes like reducing food delivery orders by 2x per week can save ₹2,000-3,000 monthly. Keep tracking your expenses — awareness is the first step to financial health! 📈`;
}

module.exports = { askGemini };
