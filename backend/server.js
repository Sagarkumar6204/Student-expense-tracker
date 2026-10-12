// backend/server.js
// Student Expense Tracker - Backend Server Entry Point (CommonJS)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (if configured in .env)
connectDB();

// Middleware: CORS for development with mobile app
// In production, configure origin to specific frontend domain / mobile bundle identifier
app.use(cors());

// Middleware: Body parser
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Student Expense Tracker API',
    version: '1.0.0',
    status: 'online',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Student Expense Tracker API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler (Safe: Never exposes stack traces or sensitive credentials)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred. Please try again later.',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API:    http://localhost:${PORT}/api/auth`);
  console.log(`💸 Expenses:    http://localhost:${PORT}/api/expenses\n`);
});
