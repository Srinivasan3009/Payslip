import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5870/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper sign-in">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div className="input-group">
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>
          <div className="remember">
            <label>
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
              />{' '}
              Show Password
            </label>
          </div>
          <button type="submit" style={{ marginTop: '30px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
