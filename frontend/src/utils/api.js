import axios from "axios";

// 🚀 Dynamic BASE_URL: localhost in dev, /api in production
const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5001/api" 
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
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

// User APIs
export const userAPI = {
  updateProfile: (data) => api.put('/auth/profile', data), 
  getUserByUsername: (username) => api.get(`/auth/user/${username}`),
  uploadProfilePic: (data) => api.post('/auth/upload-avatar', data),
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