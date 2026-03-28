const mongoose = require('mongoose');

const keywordMapSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    lowercase: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
  },
  confidence: {
    type: Number,
    default: 0.8,
  },
}, { timestamps: true });

module.exports = mongoose.model('KeywordMap', keywordMapSchema);
