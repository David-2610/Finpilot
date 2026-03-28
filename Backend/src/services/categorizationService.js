const KeywordMap = require('../models/KeywordMap');

const autoCategorize = async (transaction) => {
  try {
    const rules = await KeywordMap.find().lean();
    
    let bestMatchMatch = null;
    let highestConfidence = 0;

    for (const rule of rules) {
      if (transaction.rawDescription.toLowerCase().includes(rule.keyword.toLowerCase()) || 
          (transaction.merchant && transaction.merchant.toLowerCase().includes(rule.keyword.toLowerCase()))) {
        
        if (rule.confidence > highestConfidence) {
          highestConfidence = rule.confidence;
          bestMatchMatch = rule;
        }
      }
    }

    if (bestMatchMatch) {
      transaction.categoryId = bestMatchMatch.categoryId;
      transaction.subcategoryId = bestMatchMatch.subcategoryId || null;
      transaction.confidenceScore = highestConfidence;
      transaction.isAutoCategorized = true;
    }

    return transaction;
  } catch (error) {
    console.error('Error in autoCategorize:', error);
    return transaction; // return uncategorized
  }
};

module.exports = { autoCategorize };
