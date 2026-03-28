const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/insights', protect, getInsights);

module.exports = router;
