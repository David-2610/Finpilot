require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// In a serverless environment like Vercel, this will execute once globally and cache connection
connectDB()
  .then(() => console.log('Database connection initialized for Vercel'))
  .catch((err) => console.error('Database connection failed', err));

module.exports = app;
