// ─────────────────────────────────────────────────────
// Wallet verification service using ethers.js
// ─────────────────────────────────────────────────────
const { ethers } = require("ethers");

// Standard message for wallet signature verification
const SIGN_MESSAGE = "Sign this message to authenticate with FinPilot. Nonce: finpilot-2026";

/**
 * Get the message that user should sign with their wallet
 * @returns {{ message: string }}
 */
function getSignMessage() {
  return {
    message: SIGN_MESSAGE,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Verify a wallet signature
 * @param {string} address - claimed wallet address
 * @param {string} signature - signature from MetaMask
 * @returns {{ verified: boolean, address: string }}
 */
function verifySignature(address, signature) {
  try {
    const recoveredAddress = ethers.verifyMessage(SIGN_MESSAGE, signature);
    const isValid = recoveredAddress.toLowerCase() === address.toLowerCase();

    return {
      verified: isValid,
      address: recoveredAddress,
      claimed: address,
    };
  } catch (error) {
    console.error("Wallet verification error:", error.message);
    return {
      verified: false,
      address: null,
      claimed: address,
      error: error.message,
    };
  }
}

module.exports = { getSignMessage, verifySignature, SIGN_MESSAGE };
