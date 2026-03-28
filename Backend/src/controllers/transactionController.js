const { parseSBICSV } = require('../services/csvParserService');
const { autoCategorize } = require('../services/categorizationService');
const Transaction = require('../models/Transaction');
const KeywordMap = require('../models/KeywordMap');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

const uploadTransactions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const transactions = await parseSBICSV(req.file.path);
    const userId = req.user._id;

    // Optional: Seed default categories/keywords just for this prototype
    const miscCat = await Category.findOne({ name: 'Miscellaneous' }) || await Category.create({ name: 'Miscellaneous', isDefault: true});
    const subCat = await Category.findOne({ name: 'Subscriptions' }) || await Category.create({ name: 'Subscriptions', isDefault: true});
    const grocCat = await Category.findOne({ name: 'Groceries' }) || await Category.create({ name: 'Groceries', isDefault: true});
    const incCat = await Category.findOne({ name: 'Income' }) || await Category.create({ name: 'Income', isDefault: true});

    // Seed dummy keywords if empty
    const count = await KeywordMap.countDocuments();
    if (count === 0) {
       await KeywordMap.create([
          { keyword: 'zepto', categoryId: grocCat._id, confidence: 0.9 },
          { keyword: 'google', categoryId: subCat._id, confidence: 0.9 },
          { keyword: 'interest', categoryId: incCat._id, confidence: 0.95 },
          { keyword: 'upi/cr', categoryId: incCat._id, confidence: 0.6 },
       ]);
    }

    const processedTxns = [];
    for (let txn of transactions) {
      txn.userId = userId;
      let categorizedTxn = await autoCategorize(txn);
      
      if (!categorizedTxn.categoryId) {
        // Fallback
        categorizedTxn.categoryId = miscCat._id;
        categorizedTxn.confidenceScore = 0.1;
      }
      processedTxns.push(categorizedTxn);
    }

    const savedTxns = await Transaction.insertMany(processedTxns);

    res.status(201).json({
      message: 'File processed successfully',
      count: savedTxns.length,
      data: savedTxns
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('categoryId', 'name icon')
      .populate('subcategoryId', 'name')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 1. Update the target transaction
    transaction.categoryId = categoryId || transaction.categoryId;
    transaction.subcategoryId = subcategoryId || transaction.subcategoryId;
    transaction.isAutoCategorized = false; // User manual override
    const updatedTxn = await transaction.save();

    // 2. SMART BULK UPDATE:
    // Apply this category change to ALL future and existing transactions 
    // from the same vendor/details for this user.
    if (categoryId && transaction.details) {
      await Transaction.updateMany(
        { 
          userId: req.user._id, 
          details: transaction.details 
        },
        { 
          $set: { 
            categoryId: categoryId,
            subcategoryId: subcategoryId || null,
            isAutoCategorized: false 
          } 
        }
      );
    }

    res.json({
      message: 'Transaction updated and vendor preference applied globally',
      data: updatedTxn
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadTransactions,
  getTransactions,
  updateTransaction,
};
