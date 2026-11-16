import React, { useState } from 'react';
import axios from 'axios';

const ExpenseFilter = () => {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token'); // get JWT from storage

      const response = await axios.get('http://localhost:5000/api/expenseform', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          category: category || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }
      });

      setExpenses(response.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  return (
    <div className="filter-container">
      <h2>Filter Expenses</h2>

      <div>
        <label>Category:</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>

      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <button onClick={fetchExpenses}>Fetch</button>

      <div className="results">
        <h3>Results</h3>
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul>
            {expenses.map(exp => (
              <li key={exp._id}>
                <strong>{exp.category}</strong> - ${exp.amount} on {new Date(exp.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseFilter;
