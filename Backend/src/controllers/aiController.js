const { getFinancialInsights, processAudioChat } = require('../services/aiService');
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
 * Handle voice-to-voice chat
 * 1. Takes audio file from multer
 * 2. Gets financial summary for context
 * 3. Sends both to Gemini
 * 4. Sends Gemini's text response to ElevenLabs
 * 5. Returns MP3 audio
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

    // 2. Process Audio-to-Text with Gemini (already provides the wisdom)
    const audioBuffer = fs.readFileSync(req.file.path);
    const aiTextResponse = await processAudioChat(audioBuffer, req.file.mimetype, summaryData);

    // Cleanup uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // 3. Return JSON with the AI's wisdom
    // Frontend will receive this and use Puter.js to read it out loud.
    return res.json({
      success: true,
      message: "AI Advice generated from your voice.",
      text: aiTextResponse,
      usePuterVoice: true
    });

  } catch (error) {
    console.error('Voice Chat Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInsights, handleVoiceChat };
