import API from './api.js';

// Register user
export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// Logout user
export const logout = async () => {
  try {
    await API.get('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Get current user
export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

// Update password
export const updatePassword = async (passwords) => {
  const response = await API.put('/auth/updatepassword', passwords);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await API.post('/auth/forgotpassword', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await API.put(`/auth/resetpassword/${token}`, { password });
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};
