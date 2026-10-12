// backend/models/Expense.js
// Expense Schema and Model (CommonJS)

const mongoose = require('mongoose');

const allowedCategories = ['Food', 'Travel', 'Education', 'Shopping', 'Other'];

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an expense amount'],
      min: [0.01, 'Expense amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: allowedCategories,
        message: 'Category must be one of: Food, Travel, Education, Shopping, Other',
      },
    },
    date: {
      type: String,
      required: [true, 'Please provide the expense date (YYYY-MM-DD)'],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        'Date must be in YYYY-MM-DD format',
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
