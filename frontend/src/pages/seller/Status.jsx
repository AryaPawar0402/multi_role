import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getToken, removeToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const Status = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/seller/login');
          return;
        }

        const res = await api.get('/seller/status', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStatus(res.data); // ✅ fix: backend returns plain string
      } catch (err) {
        setError('Failed to fetch status. Please login again.');
        removeToken();
        navigate('/seller/login');
      }
    };

    fetchStatus();
  }, [navigate]);

  return (
    <div className="status-container">
      <h2>Your Seller Approval Status</h2>

      {error && <p className="error-msg">{error}</p>}

      {status === 'PENDING' && (
        <p className="status-pending">Your registration is pending approval by Admin.</p>
      )}

      {status === 'APPROVED' && (
        <p className="status-approved">Congratulations! You are an approved seller.</p>
      )}

      {!status && !error && <p>Loading status...</p>}
    </div>
  );
};

export default Status;
