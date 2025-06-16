import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { saveUserToken } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await api.post('/user/login', { email, password });
      saveUserToken(response.data.token);
      navigate('/user/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="centered-form-page">
      <div className="form-container">
        <h2>User Login</h2>
        <form onSubmit={handleSubmit} className="form-box">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-submit">Login</button>
        </form>

        <p className="redirect-text">
          Don't have an account? <Link to="/user/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
