import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { getToken, removeToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUser({ ...res.data, password: '' });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.status === 401) {
          removeToken();
          navigate('/user/login');
        } else {
          setError('Failed to load profile');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!user.name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (user.password && user.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await api.put(
        '/user/profile',
        {
          name: user.name,
          password: user.password,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setSuccessMsg('Profile updated successfully!');
      setEditMode(false);
      setUser(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/user/login');
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="centered-form-page">
      <div className="form-container">
        <h2>User Profile</h2>
        <form className="form-box" onSubmit={handleUpdate}>
          <label>Email (cannot change)</label>
          <input type="email" value={user.email} disabled />

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!editMode}
            required
          />

          <label>Password {editMode && '(leave blank to keep current)'}</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            disabled={!editMode}
            placeholder={editMode ? 'New password' : ''}
          />

          {error && <p className="error-msg">{error}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}

          {!editMode ? (
            <button
              type="button"
              className="btn-submit"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button type="submit" className="btn-submit">
                Save Changes
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditMode(false);
                  setError('');
                  setSuccessMsg('');
                  setUser(prev => ({ ...prev, password: '' }));
                }}
              >
                Cancel
              </button>
            </>
          )}
        </form>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
