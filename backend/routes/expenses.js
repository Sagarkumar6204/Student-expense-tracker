const express = require('express');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');
const checkDbConnection = require('../middleware/checkDb');

const router = express.Router();

// All expense routes require a connected DB and a valid authenticated user
router.use(checkDbConnection);
router.use(authMiddleware);

const ALLOWED_CATEGORIES = ['Food', 'Travel', 'Education', 'Shopping', 'Other'];

// -------------------------------------------------------------
// GET /api/expenses - List all expenses belonging to logged-in user
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { category, month, year } = req.query;
    const filter = { userId: req.user.id };

    if (category && ALLOWED_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    // Optional date prefix filter (e.g. "2026-10")
    if (year && month) {
      const monthPadded = String(month).padStart(2, '0');
      filter.date = new RegExp(`^${year}-${monthPadded}`);
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });

    return res.json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error('Fetch expenses error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// GET /api/expenses/summary - Get total expenses for the current month
// -------------------------------------------------------------
router.get('/summary', async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthNum = today.getMonth() + 1; // 1-12
    const currentMonthPadded = String(currentMonthNum).padStart(2, '0');
    const monthPrefix = `${currentYear}-${currentMonthPadded}`;
    const currentMonthName = today.toLocaleString('en-IN', { month: 'long' });

    // Find all expenses in current month for this user
    const currentMonthExpenses = await Expense.find({
      userId: req.user.id,
      date: new RegExp(`^${monthPrefix}`),
    });

    const totalAmount = currentMonthExpenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    return res.json({
      success: true,
      summary: {
        currentMonthName,
        currentYear,
        monthPrefix,
        totalAmount,
        count: currentMonthExpenses.length,
      },
    });
  } catch (error) {
    console.error('Expense summary error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute monthly expense summary.',
    });
  }
});

// -------------------------------------------------------------
// POST /api/expenses - Add a new expense
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // 1. Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Expense title is required',
      });
    }

    // 2. Validate amount (must be positive number)
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number greater than 0',
      });
    }

    // 3. Validate category strictly
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    // 4. Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const finalDate = date && dateRegex.test(date.trim())
      ? date.trim()
      : new Date().toISOString().split('T')[0];

    const newExpense = new Expense({
      userId: req.user.id,
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: finalDate,
    });

    await newExpense.save();

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense: newExpense,
    });
  } catch (error) {
    console.error('Create expense error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to save expense. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// PUT /api/expenses/:id - Update an existing expense (Owner Only)
// -------------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found',
      });
    }

    // Strict ownership verification: only author can edit
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own expenses',
      });
    }

    // Validate updates
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ success: false, message: 'Expense title cannot be empty' });
      }
      expense.title = title.trim();
    }

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number greater than 0',
        });
      }
      expense.amount = parsedAmount;
    }

    if (category !== undefined) {
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
        });
      }
      expense.category = category;
    }

    if (date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Date must be in YYYY-MM-DD format',
        });
      }
      expense.date = date.trim();
    }

    await expense.save();

    return res.json({
      success: true,
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    console.error('Update expense error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update expense.',
    });
  }
});

// -------------------------------------------------------------
// DELETE /api/expenses/:id - Delete an expense (Owner Only)
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found',
      });
    }

    // Strict ownership verification: only author can delete
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own expenses',
      });
    }

    await Expense.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Expense deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete expense error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete expense.',
    });
  }
});

module.exports = router;
