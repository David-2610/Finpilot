// ─────────────────────────────────────────────────────
// Process route - FULL PIPELINE (most important endpoint)
// ─────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { storeOnIPFS } = require("../services/ipfsService");
const { analyzeTransactions } = require("../services/analysisService");
const { generateInsight, generateChatReply } = require("../services/chatService");
const { textToSpeech } = require("../services/ttsService");
const { evaluateAchievements } = require("../services/certifyService");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /process
 * Full pipeline: IPFS → Analyze → AI Insight → Chat → TTS → CertifyX
 *
 * Body: {
 *   wallet: string,
 *   transactions: Array<{ description: string, amount: number }>
 * }
 *
 * Response: {
 *   ipfs: { hash },
 *   totals: {},
 *   alerts: [],
 *   ai_insight: string,
 *   reply: string,
 *   audio: {} | null,
 *   certificate: {} | null
 * }
 */
router.post("/", asyncHandler(async (req, res) => {
  const { wallet, transactions } = req.body;

  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Missing or empty 'transactions' array",
      example: {
        wallet: "0x1234...",
        transactions: [
          { description: "Swiggy Order", amount: 450 },
          { description: "Netflix Subscription", amount: 649 },
          { description: "Uber Ride", amount: 250 },
        ],
      },
    });
  }

  console.log(`\n🚀 Processing pipeline for wallet: ${wallet || "anonymous"}`);
  console.log(`   📋 Transactions: ${transactions.length}`);

  // ── Step 1: Store on IPFS ──────────────────────────
  console.log("   📦 Step 1: Storing on IPFS...");
  const ipfsResult = await storeOnIPFS({
    wallet: wallet || "anonymous",
    transactions,
    processedAt: new Date().toISOString(),
  });

  // ── Step 2: Categorize transactions ────────────────
  console.log("   📊 Step 2: Categorizing transactions...");
  const analysis = analyzeTransactions(transactions);

  // ── Step 3: Generate AI insight ────────────────────
  console.log("   🤖 Step 3: Generating AI insights...");
  const ai_insight = await generateInsight(analysis.totals, analysis.alerts);

  // ── Step 4: Generate chatbot reply ─────────────────
  console.log("   💬 Step 4: Generating chatbot advice...");
  const reply = await generateChatReply(
    "Based on my spending data, what should I focus on improving?",
    analysis.totals,
    analysis.alerts
  );

  // ── Step 5: Text-to-Speech (optional) ──────────────
  console.log("   🎤 Step 5: Converting to speech...");
  let audio = null;
  try {
    const ttsResult = await textToSpeech(reply);
    if (ttsResult.success) {
      audio = {
        base64: ttsResult.audio,
        contentType: ttsResult.contentType,
        size: ttsResult.size,
      };
    } else {
      audio = { available: false, reason: ttsResult.message };
    }
  } catch (err) {
    audio = { available: false, reason: err.message };
  }

  // ── Step 6: CertifyX achievements ─────────────────
  console.log("   🏆 Step 6: Evaluating achievements...");
  const certifyResult = evaluateAchievements({
    totals: analysis.totals,
    alerts: analysis.alerts,
    wallet: wallet || "anonymous",
  });

  console.log(`   ✅ Pipeline complete! ${certifyResult.newAchievements} achievement(s) earned.\n`);

  // ── Final Response ─────────────────────────────────
  res.json({
    success: true,
    message: "🚀 Full pipeline processed successfully",
    data: {
      ipfs: {
        hash: ipfsResult.hash,
        source: ipfsResult.source,
      },
      totals: analysis.totals,
      alerts: analysis.alerts,
      summary: analysis.summary,
      ai_insight,
      reply,
      audio,
      certificate: certifyResult.certificates.length > 0
        ? certifyResult.certificates
        : null,
      achievements: {
        earned: certifyResult.newAchievements,
        total: certifyResult.totalIssued,
      },
      processedAt: new Date().toISOString(),
    },
  });
}));

module.exports = router;
