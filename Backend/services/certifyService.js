// ─────────────────────────────────────────────────────
// CertifyX achievement/certificate service (mock)
// ─────────────────────────────────────────────────────

// Achievement definitions
const achievements = [
  {
    id: "first_analysis",
    name: "🏅 First Analysis Complete",
    description: "Completed your first financial analysis with FinPilot",
    condition: (data) => true, // Always triggered on first run
  },
  {
    id: "budget_conscious",
    name: "💰 Budget Conscious",
    description: "All spending categories are within healthy limits",
    condition: (data) => data.alerts && data.alerts.length === 0,
  },
  {
    id: "savings_champion",
    name: "🏆 Savings Champion",
    description: "Savings exceed ₹10,000",
    condition: (data) => (data.totals?.savings || 0) > 10000,
  },
  {
    id: "spending_reduced",
    name: "📉 Spending Reducer",
    description: "Total spending is under ₹15,000 — great discipline!",
    condition: (data) => {
      const total = Object.values(data.totals || {}).reduce((s, v) => s + v, 0);
      return total < 15000;
    },
  },
  {
    id: "diversified_spender",
    name: "🎯 Diversified Spender",
    description: "Spending across 5+ categories shows balanced habits",
    condition: (data) => Object.keys(data.totals || {}).length >= 5,
  },
];

// Track issued certificates in-memory
const issuedCertificates = [];

/**
 * Evaluate and issue achievements based on analysis data
 * @param {Object} data - { totals, alerts, wallet? }
 * @returns {{ certificates: Array, newAchievements: number }}
 */
function evaluateAchievements(data) {
  const earned = [];

  for (const achievement of achievements) {
    try {
      if (achievement.condition(data)) {
        const certificate = {
          certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          achievementId: achievement.id,
          name: achievement.name,
          description: achievement.description,
          wallet: data.wallet || "anonymous",
          issuedAt: new Date().toISOString(),
          issuer: "FinPilot CertifyX",
          verified: true,
        };

        earned.push(certificate);
        issuedCertificates.push(certificate);
      }
    } catch (err) {
      console.error(`Achievement eval error (${achievement.id}):`, err.message);
    }
  }

  return {
    certificates: earned,
    newAchievements: earned.length,
    totalIssued: issuedCertificates.length,
  };
}

/**
 * Get all issued certificates
 * @returns {Array} all certificates
 */
function getAllCertificates() {
  return issuedCertificates;
}

module.exports = { evaluateAchievements, getAllCertificates };
