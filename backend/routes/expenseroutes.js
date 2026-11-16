const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const auth = require('../middleware/auth');

// GET /api/expenses - Get all expenses, with optional filters
router.get('/', auth, async (req, res) => {
  const { category, startDate, endDate } = req.query;

  let filter = { userId: req.user.id };

  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  try {
    const expenses = await Expense.find(filter);
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/expenses - Create a new expense
router.post('/', auth, async (req, res) => {
  const { amount, category, date, description } = req.body;

  try {
    const newExpense = new Expense({
      userId: req.user.id,
      amount,
      category,
      date,
      description,
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/expenses/:id - Update an expense by id
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const { amount, category, date, description } = req.body;

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.description = description || expense.description;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/expenses/:id - Delete an expense by id
router.delete('/:id', async (req, res) => {
  try {
    const expenseId = req.params.id;
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully', expense: deletedExpense });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/expenses/summary - Get expense summary grouped by year, month and category
router.get('/summary', auth, async (req, res) => {
  try {
    const summaries = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category',
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.category': 1 } },
    ]);
    res.json(summaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
