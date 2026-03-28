const mongoose = require('mongoose');

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    // Disable buffering to fail fast if not connected
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
