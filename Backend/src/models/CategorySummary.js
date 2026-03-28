const mongoose = require('mongoose');

const categorySummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: String, // Format: YYYY-MM
    required: true,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  breakdown: [
    {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
      amount: {
        type: Number,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('CategorySummary', categorySummarySchema);
