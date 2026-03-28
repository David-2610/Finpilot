// ─────────────────────────────────────────────────────
// Category keyword mapping for transaction classification
// ─────────────────────────────────────────────────────

const categoryKeywords = {
  food: ["swiggy", "zomato", "mcdonald", "dominos", "pizza", "burger", "restaurant", "cafe", "food", "eat"],
  subscriptions: ["netflix", "spotify", "amazon prime", "hotstar", "youtube premium", "apple music", "hulu", "disney"],
  transport: ["uber", "ola", "rapido", "metro", "bus", "fuel", "petrol", "diesel", "parking", "toll"],
  shopping: ["amazon", "flipkart", "myntra", "ajio", "meesho", "mall", "shop", "store", "purchase"],
  utilities: ["electricity", "water", "gas", "wifi", "internet", "phone", "recharge", "broadband", "bill"],
  entertainment: ["movie", "game", "concert", "event", "ticket", "play", "show", "theater"],
  health: ["hospital", "pharmacy", "medicine", "doctor", "clinic", "gym", "fitness", "yoga"],
  education: ["course", "udemy", "coursera", "book", "tuition", "school", "college", "exam"],
  rent: ["rent", "lease", "housing", "apartment", "flat"],
  savings: ["savings", "deposit", "investment", "mutual fund", "sip", "fd", "rd"],
  salary: ["salary", "income", "wage", "stipend", "freelance", "payment received"],
};

/**
 * Categorize a single transaction based on keyword matching
 * @param {Object} transaction - { description: string, amount: number, type?: string }
 * @returns {string} category name
 */
function categorizeTransaction(transaction) {
  const desc = (transaction.description || "").toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (desc.includes(keyword)) {
        return category;
      }
    }
  }

  return "other";
}

/**
 * Categorize all transactions and compute totals per category
 * @param {Array} transactions - array of { description, amount, type? }
 * @returns {{ totals: Object, categorized: Array }}
 */
function categorizeAll(transactions) {
  const totals = {};
  const categorized = [];

  for (const tx of transactions) {
    const category = categorizeTransaction(tx);
    const amount = parseFloat(tx.amount) || 0;

    totals[category] = (totals[category] || 0) + amount;
    categorized.push({ ...tx, category });
  }

  return { totals, categorized };
}

module.exports = { categorizeTransaction, categorizeAll, categoryKeywords };
