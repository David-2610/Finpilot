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

/**
 * Send voice prompt (audio buffer) + summary context to Gemini
 * Get wisdom back as text
 */
const processAudioChat = async (audioBuffer, mimeType, summaryData) => {
  try {
    const promptText = `
      You are Finpilot, a professional but friendly senior financial advisor. 
      The user is speaking to you directly via voice. 
      
      CRITICAL INSTRUCTIONS:
      1. Analyze the user's voice prompt alongside their financial summary below.
      2. Provide a concise, highly actionable response under 60 words.
      3. Focus on specific saving strategies based on their high-spending categories.
      4. Always sound encouraging but firm about financial discipline.

      --- USER FINANCIAL DATA ---
      Total Income: ${summaryData.totalIncome}
      Total Expenses: ${summaryData.totalExpenses}
      Monthly Category Breakdown: ${JSON.stringify(summaryData.categoryBreakdown)}
      --- END OF DATA ---
      
      Now, listen carefully to the user's audio and respond.
    `;

    const audioBase64 = audioBuffer.toString('base64');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: audioBase64
                }
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your question.";
  } catch (error) {
    console.error('Gemini Audio Error:', error.response?.data || error.message);
    throw new Error('Gemini failed to process audio');
  }
};

const processUniversalChat = async (prompt, audioBuffer, mimeType, summaryData) => {
  try {
    const systemPrompt = `
      You are Finpilot, a professional senior financial advisor.
      
      FINANCIAL CONTEXT:
      - Total Income: ₹${summaryData.totalIncome}
      - Total Expenses: ₹${summaryData.totalExpenses}
      - Category Breakdown: ${JSON.stringify(summaryData.categoryBreakdown)}

      INSTRUCTIONS:
      1. Use the financial context above to provide specific, data-driven advice.
      2. If the user provides a text prompt, answer it.
      3. If the user provides audio, listen and respond to the speech.
      4. Keep responses concise (under 75 words) and highly actionable.
    `;

    const parts = [{ text: systemPrompt }];
    if (prompt) parts.push({ text: `User Message: ${prompt}` });
    
    if (audioBuffer) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: audioBuffer.toString('base64')
        }
      });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request.";
  } catch (error) {
    console.error('Gemini Chat Error:', error.response?.data || error.message);
    throw new Error('Chat processing failed');
  }
};

module.exports = { getFinancialInsights, processAudioChat, processUniversalChat };
