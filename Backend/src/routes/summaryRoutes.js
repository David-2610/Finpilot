const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/summaryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getSummary);

module.exports = router;
