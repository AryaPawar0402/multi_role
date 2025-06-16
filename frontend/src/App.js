import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Welcome from './pages/Welcome';

// Admin
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/Register';
import AdminProfile from './pages/admin/Profile';
import PendingSellers from './pages/admin/PendingSellers';
import ApprovedSellers from './pages/admin/ApprovedSellers';

// Seller
import SellerLogin from './pages/seller/Login';
import SellerRegister from './pages/seller/Register';
import SellerProfile from './pages/seller/Profile';
import SellerStatus from './pages/seller/Status';

// User
import UserLogin from './pages/user/Login';
import UserRegister from './pages/user/Register';
import UserProfile from './pages/user/Profile';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const Layout = ({ children }) => {
  const location = useLocation();

  // Extract role from URL path
  const role = location.pathname.split('/')[1]; // 'admin', 'seller', 'user'

  // Hide Navbar on login/register/welcome pages
  const hideNavbarRoutes = [
    '/',
    '/admin/login',
    '/admin/register',
    '/seller/login',
    '/seller/register',
    '/user/login',
    '/user/register',
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar role={role} />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Shared */}
          <Route path="/" element={<Welcome />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/profile" element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/pending-sellers" element={
            <ProtectedRoute>
              <PendingSellers />
            </ProtectedRoute>
          } />
          <Route path="/admin/approved-sellers" element={
            <ProtectedRoute>
              <ApprovedSellers />
            </ProtectedRoute>
          } />

          {/* Seller Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/profile" element={
            <ProtectedRoute>
              <SellerProfile />
            </ProtectedRoute>
          } />
          <Route path="/seller/status" element={
            <ProtectedRoute>
              <SellerStatus />
            </ProtectedRoute>
          } />

          {/* User Routes */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
