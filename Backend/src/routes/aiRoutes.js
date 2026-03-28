const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getInsights, handleVoiceChat } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const upload = multer({ dest: '/tmp/' });

router.post('/insights', protect, getInsights);
router.post('/voice-chat', protect, upload.single('audio'), handleVoiceChat);

module.exports = router;
