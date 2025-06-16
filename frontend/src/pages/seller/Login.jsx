import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { saveSellerToken } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await api.post('/seller/login', { email, password });
      saveSellerToken(res.data.token);
      navigate('/seller/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="centered-form-page">
      <div className="form-container">
        <h2>Seller Login</h2>
        <form className="form-box" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="seller@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-submit">Login</button>
        </form>

        <p className="redirect-text">
          Don't have an account?{' '}
          <Link to="/seller/register" className="redirect-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
