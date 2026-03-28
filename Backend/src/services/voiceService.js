const axios = require('axios');

/**
 * Convert text to speech using Play.ht API (V2)
 * @param {string} text - The text to convert to audio
 * @returns {Buffer} - The audio data buffer (MP3)
 */
const textToSpeech = async (text) => {
  const apiKey = process.env.PLAYHT_API_KEY;
  const userId = process.env.PLAYHT_USER_ID;
  const voiceId = process.env.PLAYHT_VOICE_ID || 's3://voice-cloning-zero-shot/d9f4nd7/aria/manifest.json'; // Default 'Aria'

  if (!apiKey || !userId) {
    throw new Error('PLAYHT_API_KEY or PLAYHT_USER_ID is missing in environment variables');
  }

  try {
    // Play.ht V2 API uses a streaming endpoint for instant audio
    const response = await axios({
      method: 'post',
      url: 'https://api.play.ht/api/v2/tts/stream',
      data: {
        text: text,
        voice: voiceId,
        output_format: 'mp3',
        speed: 1,
        sample_rate: 24000,
      },
      headers: {
        'Authorization': apiKey,
        'X-User-ID': userId,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  } catch (error) {
    // If Play.ht fails, we throw to the controller which handles the fallback
    console.error('Play.ht API Error:', error.response?.data?.toString() || error.message);
    throw new Error('Failed to generate speech with Play.ht');
  }
};

module.exports = { textToSpeech };
