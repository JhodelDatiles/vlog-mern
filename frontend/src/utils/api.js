import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true 
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// User APIs (New)
export const userAPI = {
  // This matches the call in EditUser.js
  updateProfile: (data) => api.put('/auth/profile', data), 
  getProfile: (username) => api.get(`/auth/profile/${username}`),
uploadProfilePic: (data) => api.post('/auth/upload-avatar', data), // Must match the mount path
};

// Post APIs
export const postAPI = {
  getAllPosts: () => api.get('/posts'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.put(`/posts/${id}/like`),
  addComment: (id, comment) => api.post(`/posts/${id}/comments`, comment),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;