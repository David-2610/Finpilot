// ─────────────────────────────────────────────────────
// ElevenLabs Text-to-Speech service
// ─────────────────────────────────────────────────────
require("dotenv").config();
const axios = require("axios");

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const ELEVEN_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - default voice
const ELEVEN_URL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`;

/**
 * Convert text to speech using ElevenLabs API
 * @param {string} text - text to convert to speech
 * @returns {{ audio: Buffer|null, contentType: string, success: boolean }}
 */
async function textToSpeech(text) {
  if (!ELEVEN_API_KEY || ELEVEN_API_KEY === "your_key") {
    console.warn("⚠️ ElevenLabs API key not set, skipping TTS");
    return {
      success: false,
      audio: null,
      contentType: null,
      message: "TTS not available — API key not configured",
    };
  }

  try {
    // Truncate text if too long (ElevenLabs has limits)
    const truncatedText = text.substring(0, 2500);

    const response = await axios.post(
      ELEVEN_URL,
      {
        text: truncatedText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
        timeout: 30000,
      }
    );

    const audioBuffer = Buffer.from(response.data);
    const audioBase64 = audioBuffer.toString("base64");

    return {
      success: true,
      audio: audioBase64,
      contentType: "audio/mpeg",
      size: audioBuffer.length,
      message: "Audio generated successfully",
    };
  } catch (error) {
    console.error("ElevenLabs TTS error:", error.response?.data || error.message);
    return {
      success: false,
      audio: null,
      contentType: null,
      message: `TTS failed: ${error.message}`,
    };
  }
}

module.exports = { textToSpeech };
