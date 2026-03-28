const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: true,
  },
  balanceAfter: {
    type: Number,
  },
  rawDescription: {
    type: String,
    required: true,
  },
  merchant: {
    type: String,
  },
  counterparty: {
    type: String,
  },
  paymentMode: {
    type: String,
    enum: ['UPI', 'IMPS', 'NEFT', 'OTHER'],
    default: 'OTHER',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
  },
  isAutoCategorized: {
    type: Boolean,
    default: false,
  },
  confidenceScore: {
    type: Number,
    default: 0,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
