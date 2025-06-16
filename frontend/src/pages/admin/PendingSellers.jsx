import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getToken, removeToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const PendingSellers = () => {
  const navigate = useNavigate();
  const [pendingSellers, setPendingSellers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingSellers = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/admin/login');
          return;
        }
        const res = await api.get('/admin/pending-sellers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingSellers(res.data);
      } catch (err) {
        removeToken();
        navigate('/admin/login');
      }
    };
    fetchPendingSellers();
  }, [navigate]);

  const approveSeller = async (id) => {
    setError('');
    try {
      const token = getToken();
      await api.put(
        `/admin/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingSellers(pendingSellers.filter((s) => s.id !== id));
    } catch (err) {
      setError('Failed to approve seller');
    }
  };

  return (
    <div className="list-container">
      <h2>Pending Sellers</h2>
      {error && <p className="error-msg">{error}</p>}
      {pendingSellers.length === 0 ? (
        <p>No pending sellers.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {pendingSellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.name}</td>
                <td>{seller.email}</td>
                <td>{seller.status}</td>
                <td>
                  <button
                    onClick={() => approveSeller(seller.id)}
                    className="btn-approve"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingSellers;
