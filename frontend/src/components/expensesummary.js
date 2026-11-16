import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseSummary = ({ token }) => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = 'http://localhost:5000'; // Replace with your actual backend URL if needed

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/expenses/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err); // helpful for debugging
        setError('Failed to fetch expense summary');
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p>{error}</p>;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <h2>Expense Summary by Month and Category</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Month</th>
            <th>Category</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(({ _id, totalAmount }) => (
            <tr key={`${_id.year}-${_id.month}-${_id.category}`}>
              <td>{_id.year}</td>
              <td>{monthNames[_id.month - 1]}</td>
              <td>{_id.category}</td>
              <td>${totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseSummary;
