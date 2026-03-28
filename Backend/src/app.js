const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Register all models
require('./models/User');
require('./models/Category');
require('./models/Subcategory');
require('./models/Transaction');
require('./models/KeywordMap');
require('./models/CategorySummary');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/ai', aiRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Finpilot API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

module.exports = app;
