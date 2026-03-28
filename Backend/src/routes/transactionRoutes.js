const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadTransactions, getTransactions, updateTransaction } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

const upload = multer({ dest: '/tmp/' });

router.route('/')
  .get(protect, getTransactions);

router.route('/upload')
  .post(protect, upload.single('statement'), uploadTransactions);

router.route('/:id')
  .patch(protect, updateTransaction);

module.exports = router;
