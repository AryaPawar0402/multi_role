import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getToken, removeToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const ApprovedSellers = () => {
  const navigate = useNavigate();
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprovedSellers = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/admin/login');
          return;
        }
        const res = await api.get('/admin/approved-sellers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovedSellers(res.data);
      } catch (err) {
        removeToken();
        navigate('/admin/login');
      }
    };
    fetchApprovedSellers();
  }, [navigate]);

  return (
    <div className="list-container">
      <h2>Approved Sellers</h2>
      {error && <p className="error-msg">{error}</p>}
      {approvedSellers.length === 0 ? (
        <p>No approved sellers.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedSellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.name}</td>
                <td>{seller.email}</td>
                <td>{seller.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovedSellers;
