const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' }
        }
      }
    ];

    const totals = await Transaction.aggregate(pipeline);

    let totalIncome = 0;
    let totalExpenses = 0;

    totals.forEach((t) => {
      if (t._id === 'credit') totalIncome = t.totalAmount;
      if (t._id === 'debit') totalExpenses = t.totalAmount;
    });

    const categoryPipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'debit' } },
      {
        $group: {
          _id: '$categoryId',
          amount: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          categoryId: '$_id',
          categoryName: { $ifNull: ['$category.name', 'Uncategorized'] },
          amount: 1,
          _id: 0
        }
      }
    ];

    const categoryBreakdown = await Transaction.aggregate(categoryPipeline);

    res.json({
      totalIncome,
      totalExpenses,
      categoryBreakdown
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary };
