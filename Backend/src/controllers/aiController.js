const { getFinancialInsights } = require('../services/aiService');

const getInsights = async (req, res) => {
  try {
    const { totalIncome, totalExpenses, categoryBreakdown } = req.body;
    
    if (totalIncome === undefined || totalExpenses === undefined || !categoryBreakdown) {
       return res.status(400).json({ message: 'Missing required summary data fields' });
    }

    const advice = await getFinancialInsights({ totalIncome, totalExpenses, categoryBreakdown });
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInsights };
