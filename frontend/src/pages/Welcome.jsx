// src/pages/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1>Welcome to CraftsApp</h1>
        <p>Select your role to login or register</p>
        <div className="role-buttons">
          <button onClick={() => navigate('/admin/login')}>Admin Login</button>
          <button onClick={() => navigate('/user/login')}>User Login</button>
          <button onClick={() => navigate('/seller/login')}>Seller Login</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
