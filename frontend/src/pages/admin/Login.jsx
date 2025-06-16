import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { saveAdminToken } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/admin/login', form);
      saveAdminToken(res.data); // Token is plain string
      navigate('/admin/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="centered-form-page">
      <div className="form-container">
        <h2>Admin Login</h2>
        <form className="form-box" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-submit">Login</button>
        </form>

        {/* Styled redirect text */}
        <p className="redirect-text">
          Don’t have an account?{' '}
          <Link to="/admin/register" className="redirect-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
