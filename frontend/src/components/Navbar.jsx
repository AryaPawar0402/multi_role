// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../utils/auth';
import './Navbar.css';

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate(`/${role}/login`);
  };

  const roleTitle = {
    admin: 'Admin Dashboard',
    seller: 'Seller Portal',
    user: 'User Panel',
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        HandCrafted
      </div>

      <div className="navbar-center">
        {roleTitle[role] || 'Welcome'}
      </div>

      <div className="navbar-right">
        {isLoggedIn() && (
          <>
            <button className="nav-btn" onClick={() => navigate(`/${role}/profile`)}>Profile</button>

            {role === 'admin' && (
              <>
                <button className="nav-btn" onClick={() => navigate('/admin/pending-sellers')}>Pending Sellers</button>
                <button className="nav-btn" onClick={() => navigate('/admin/approved-sellers')}>Approved Sellers</button>
              </>
            )}

            {role === 'seller' && (
              <button className="nav-btn" onClick={() => navigate('/seller/status')}>Status</button>
            )}

            <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
