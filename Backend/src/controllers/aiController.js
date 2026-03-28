const { getFinancialInsights, processAudioChat, processUniversalChat } = require('../services/aiService');
const { textToSpeech } = require('../services/voiceService');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const fs = require('fs');

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

/**
 * Handle voice-to-voice chat (Legacy - kept for compatibility)
 */
const handleVoiceChat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    const userId = req.user._id;

    // 1. Get Summary Context
    const pipeline = [{ $match: { userId: new mongoose.Types.ObjectId(userId) } }, { $group: { _id: '$type', total: { $sum: '$amount' } } }];
    const totals = await Transaction.aggregate(pipeline);
    let totalIncome = 0, totalExpenses = 0;
    totals.forEach(t => { if (t._id === 'credit') totalIncome = t.total; if (t._id === 'debit') totalExpenses = t.total; });

    const categoryPipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'debit' } },
      { $group: { _id: '$categoryId', amount: { $sum: '$amount' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $project: { categoryName: '$cat.name', amount: 1, _id: 0 } }
    ];
    const categoryBreakdown = await Transaction.aggregate(categoryPipeline);
    const summaryData = { totalIncome, totalExpenses, categoryBreakdown };

    // 2. Process Audio-to-Text with Gemini
    const audioBuffer = fs.readFileSync(req.file.path);
    const aiTextResponse = await processAudioChat(audioBuffer, req.file.mimetype, summaryData);

    // Cleanup uploaded file
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    // 3. Return JSON with the AI's wisdom
    return res.json({
      success: true,
      text: aiTextResponse,
      usePuterVoice: true
    });

  } catch (error) {
    console.error('Voice Chat Error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handle universal chat (Text or Voice or Both)
 */
const handleUniversalChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    const audioFile = req.files?.find(f => f.fieldname === 'audio');
    
    if (!prompt && !audioFile) {
      return res.status(400).json({ message: 'No message or audio provided' });
    }

    const userId = req.user._id;

    // 1. Get Summary Context
    const pipeline = [{ $match: { userId: new mongoose.Types.ObjectId(userId) } }, { $group: { _id: '$type', total: { $sum: '$amount' } } }];
    const totals = await Transaction.aggregate(pipeline);
    let totalIncome = 0, totalExpenses = 0;
    totals.forEach(t => { if (t._id === 'credit') totalIncome = t.total; if (t._id === 'debit') totalExpenses = t.total; });

    const categoryPipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'debit' } },
      { $group: { _id: '$categoryId', amount: { $sum: '$amount' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $project: { categoryName: '$cat.name', amount: 1, _id: 0 } }
    ];
    const categoryBreakdown = await Transaction.aggregate(categoryPipeline);
    const summaryData = { totalIncome, totalExpenses, categoryBreakdown };

    // 2. Process Universal Chat
    let audioBuffer = audioFile ? fs.readFileSync(audioFile.path) : null;
    let mimeType = audioFile ? audioFile.mimetype : null;
    
    const aiTextResponse = await processUniversalChat(prompt, audioBuffer, mimeType, summaryData);

    // 3. Cleanup files
    if (audioFile && fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);

    // 4. Return
    return res.json({
      success: true,
      text: aiTextResponse,
      usePuterVoice: true
    });

  } catch (error) {
    console.error('Universal Chat Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInsights, handleVoiceChat, handleUniversalChat };
