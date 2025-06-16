import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getToken, removeToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/seller/login');
          return;
        }
        const res = await api.get('/seller/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(prev => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
        }));
      } catch (err) {
        removeToken();
        navigate('/seller/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!profile.name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (profile.password || profile.confirmPassword) {
      if (profile.password !== profile.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (profile.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      const token = getToken();
      await api.put(
        '/seller/profile',
        {
          name: profile.name.trim(),
          password: profile.password ? profile.password : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Profile updated successfully!');
      setProfile(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/seller/login');
  };

  return (
    <div className="centered-form-page">
      <div className="form-container">
        <h2>Seller Profile</h2>
        <form className="form-box" onSubmit={handleUpdate}>
          <label>Email (cannot change)</label>
          <input type="email" value={profile.email} disabled />

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />

          <label>New Password (leave blank to keep current)</label>
          <input
            type="password"
            name="password"
            placeholder="New password"
            value={profile.password}
            onChange={handleChange}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={profile.confirmPassword}
            onChange={handleChange}
          />

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button type="submit" className="btn-submit">Update Profile</button>
        </form>

        <button onClick={handleLogout} className="btn-logout" style={{ marginTop: '1rem' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
