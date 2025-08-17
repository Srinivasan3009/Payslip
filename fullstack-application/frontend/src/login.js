import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5870/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({ email, password }) // Send cookies (JWT token) with the request
      });
      const data = await response.json();
      if (response.ok) {
        // Successful login, redirect to the dashboard
        navigate('/dashboard');
      } else {
        // Show error message
        setError(data.message || 'Invalid credentials or error occurred');
      }
    } catch (error) {
      // Handle network or other errors
      setError('An error occurred. Please try again.');
      console.error('Login Error:', error);
    }
  };

  return (
    <div style={{ width: '300px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
