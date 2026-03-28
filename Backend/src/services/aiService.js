const axios = require('axios');

const getFinancialInsights = async (summaryData) => {
  try {
    const prompt = `
      You are a senior financial advisor. Analyze the following monthly spending summary for a user and suggest 3 practical cost-cutting strategies and general financial advice.
      Keep the response concise, punchy, and highly actionable. Return it as plain text without markdown markdown wrappers if possible.

      Data:
      Total Income: ${summaryData.totalIncome}
      Total Expenses: ${summaryData.totalExpenses}
      Category Breakdown: ${JSON.stringify(summaryData.categoryBreakdown)}
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const advice = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No insights could be generated at this time.";
    return advice;
  } catch (error) {
    console.error('Error fetching AI insights:', error.response?.data || error.message);
    throw new Error('Failed to generate insights from Gemini API');
  }
};

module.exports = { getFinancialInsights };
