// Token keys
const USER_TOKEN = 'user_token';
const SELLER_TOKEN = 'seller_token';
const ADMIN_TOKEN = 'admin_token';

// USER token handlers
export const saveUserToken = (token) => localStorage.setItem(USER_TOKEN, token);
export const getUserToken = () => localStorage.getItem(USER_TOKEN);
export const removeUserToken = () => localStorage.removeItem(USER_TOKEN);

// SELLER token handlers
export const saveSellerToken = (token) => localStorage.setItem(SELLER_TOKEN, token);
export const getSellerToken = () => localStorage.getItem(SELLER_TOKEN);
export const removeSellerToken = () => localStorage.removeItem(SELLER_TOKEN);

// ADMIN token handlers
export const saveAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN, token);
export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN);
export const removeAdminToken = () => localStorage.removeItem(ADMIN_TOKEN);

// Optional fallback (used only if needed)
export const getToken = () => getUserToken() || getSellerToken() || getAdminToken();
export const removeToken = () => {
  removeUserToken();
  removeSellerToken();
  removeAdminToken();
};

// ✅ Fix for import error in ProtectedRoute.jsx
export const isLoggedIn = () => {
  return !!(getUserToken() || getSellerToken() || getAdminToken());
};
