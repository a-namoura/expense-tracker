import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Expenses = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: 'food', amount: '', description: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      alert('Error loading expenses');
    }
  };

  const submitExpense = async (e) => {
    e.preventDefault();

    if (Number(form.amount) <= 0) {
      alert('Amount must be a positive number');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/expenses', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses([...expenses, res.data]);
      setForm({ category: 'food', amount: '', description: '' });
    } catch (err) {
      alert('Error adding expense');
    }
  };

  // New function to delete expense by ID
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove deleted expense from state
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) {
      alert('Error deleting expense');
    }
  };

  return (
    <div className="expenses-container">
      <h2>Your Expenses</h2>
      <form onSubmit={submitExpense} className="expense-form">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          className="input-select"
        >
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="clothes">Clothes</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="others">Others</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          min="0"
          step="0.01"
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || parseFloat(value) >= 0) {
              setForm({ ...form, amount: value });
            }
          }}
          required
          className="input-field"
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field"
        />

        <button type="submit" className="submit-button">Add</button>
      </form>

      <table className="expenses-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Description</th>
            <th>Action</th> {/* New column for Delete */}
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id}>
              <td>{e.category.charAt(0).toUpperCase() + e.category.slice(1)}</td>
              <td>{parseFloat(e.amount).toFixed(2)}</td>
              <td>{e.description || '-'}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => {
                    if(window.confirm('Are you sure you want to delete this expense?')) {
                      deleteExpense(e._id);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;
