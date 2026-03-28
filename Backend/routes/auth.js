// ─────────────────────────────────────────────────────
// Auth routes - Web3 wallet authentication
// ─────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { getSignMessage, verifySignature } = require("../services/walletService");

/**
 * GET /auth/message
 * Returns the message that the user should sign with their wallet
 */
router.get("/message", (req, res) => {
  const result = getSignMessage();
  res.json({
    success: true,
    data: result,
  });
});

/**
 * POST /auth/verify
 * Verifies wallet signature using ethers.js
 * Body: { address: string, signature: string }
 */
router.post("/verify", (req, res) => {
  const { address, signature } = req.body;

  if (!address || !signature) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: address and signature",
    });
  }

  const result = verifySignature(address, signature);

  if (result.verified) {
    res.json({
      success: true,
      message: "✅ Wallet verified successfully",
      data: {
        address: result.address,
        verified: true,
        timestamp: new Date().toISOString(),
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "❌ Wallet verification failed",
      data: result,
    });
  }
});

module.exports = router;
