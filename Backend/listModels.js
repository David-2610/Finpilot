require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function listModels() {
  try {
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const models = response.data.models
      .filter(m => m.supportedGenerationMethods.includes('generateContent'))
      .map(m => m.name);
    fs.writeFileSync('models.json', JSON.stringify(models, null, 2));
  } catch (error) {
    console.error("Error fetching models:", error.response?.data || error.message);
  }
}

listModels();
