// ─────────────────────────────────────────────────────
// Chat route - AI chatbot with optional TTS
// ─────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { generateChatReply } = require("../services/chatService");
const { textToSpeech } = require("../services/ttsService");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /chat
 * AI chatbot endpoint with optional voice output
 * Body: { message: string, data?: { totals: Object }, alerts?: Array }
 */
router.post("/", asyncHandler(async (req, res) => {
  const { message, data, alerts } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      error: "Missing 'message' field",
    });
  }

  const totals = data?.totals || data || {};

  // Step 1: Generate AI reply
  const reply = await generateChatReply(message, totals, alerts || []);

  // Step 2: Convert to speech (optional, won't fail the request)
  let audio = null;
  try {
    const ttsResult = await textToSpeech(reply);
    if (ttsResult.success) {
      audio = {
        base64: ttsResult.audio,
        contentType: ttsResult.contentType,
        size: ttsResult.size,
      };
    }
  } catch (ttsError) {
    console.warn("TTS skipped:", ttsError.message);
  }

  res.json({
    success: true,
    message: "💬 Chat response generated",
    data: {
      reply,
      audio,
      timestamp: new Date().toISOString(),
    },
  });
}));

module.exports = router;
