import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', description: '' });
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchExpenses();
    }
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err.response?.data?.message);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/expenses', form);
      setExpenses([...expenses, res.data]);
      setForm({ category: '', amount: '', description: '' });
    } catch (err) {
      alert('Failed to add expense');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(endpoint, authForm);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Auth error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setExpenses([]);
  };

  if (!token) {
    return (
      <div>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleAuthSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome to Your Expense Tracker</h2>
      <button onClick={logout}>Logout</button>

      <h3>Add Expense</h3>
      <form onSubmit={handleExpenseSubmit}>
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <h3>Your Expenses</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp._id}>
            {exp.category}: ${exp.amount} – {exp.description || 'No description'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
