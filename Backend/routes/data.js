// ─────────────────────────────────────────────────────
// Data routes - IPFS storage and retrieval
// ─────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { storeOnIPFS, retrieveFromIPFS } = require("../services/ipfsService");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /data/store
 * Stores transaction JSON data on IPFS
 * Body: { transactions: Array, wallet?: string }
 */
router.post("/store", asyncHandler(async (req, res) => {
  const { transactions, wallet } = req.body;

  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({
      success: false,
      error: "Missing or invalid 'transactions' array",
    });
  }

  const payload = {
    wallet: wallet || "anonymous",
    transactions,
    storedAt: new Date().toISOString(),
    count: transactions.length,
  };

  const result = await storeOnIPFS(payload);

  res.json({
    success: true,
    message: "📦 Data stored successfully",
    data: result,
  });
}));

/**
 * GET /data/:hash
 * Retrieves stored JSON data by IPFS hash
 */
router.get("/:hash", asyncHandler(async (req, res) => {
  const { hash } = req.params;

  if (!hash) {
    return res.status(400).json({
      success: false,
      error: "Missing hash parameter",
    });
  }

  const result = await retrieveFromIPFS(hash);

  if (result.success) {
    res.json({
      success: true,
      message: "📥 Data retrieved successfully",
      data: result.data,
      source: result.source,
    });
  } else {
    res.status(404).json({
      success: false,
      error: result.error,
    });
  }
}));

module.exports = router;
