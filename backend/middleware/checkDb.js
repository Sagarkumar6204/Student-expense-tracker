// backend/middleware/checkDb.js
// Checks if MongoDB Atlas is connected before executing database queries

const mongoose = require('mongoose');

const checkDbConnection = (req, res, next) => {
  // 1 = connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB Atlas is not connected yet. Please add your connection string to backend/.env to perform this action.',
    });
  }
  next();
};

module.exports = checkDbConnection;
