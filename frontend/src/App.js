import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Register from './components/register';
import Expenses from './components/expenseform';
import ExpenseSummary from './components/expensesummary';
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [view, setView] = useState(token ? 'expenses' : 'login');

  // Auto-logout on tab/browser close
  useEffect(() => {
    const handleUnload = () => {
      if (token) {
        localStorage.removeItem('token');
        navigator.sendBeacon('http://localhost:5000/api/logout'); // Optional: notify backend
      }
    };

    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setView('login');
  };

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>
      {token && <button onClick={handleLogout} className="logout-button">Logout</button>}

      {view === 'login' && <Login setToken={setToken} setView={setView} />}
      {view === 'register' && <Register setView={setView} />}
      {view === 'expenses' && <Expenses token={token} />}
      {view === 'summary' && <ExpenseSummary token={token} />}

      {token && (
        <div className="view-buttons">
          <button
            className={`view-button ${view === 'expenses' ? 'active' : ''}`}
            onClick={() => setView('expenses')}
          >
            View Expenses
          </button>
          <button
            className={`view-button ${view === 'summary' ? 'active' : ''}`}
            onClick={() => setView('summary')}
          >
            View Summary
          </button>
        </div>
      )}

      {!token && (
        <div className="auth-switchers">
          {view !== 'register' && (
            <button
              className="register-button"
              onClick={() => setView('register')}
            >
              Register
            </button>
          )}
          {view !== 'login' && (
            <p onClick={() => setView('login')} className="login-link">
              Already have an account? Login
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
