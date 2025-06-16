import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post('/seller/register', {
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      });
      alert('Registration successful! Please login.');
      navigate('/seller/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="centered-form-page">
      <div className="form-container">
        <h2>Seller Register</h2>
        <form className="form-box" onSubmit={handleRegister}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="seller@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-submit">Register</button>
        </form>

        <p className="redirect-text">
          Already have an account?{' '}
          <Link to="/seller/login" className="redirect-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
