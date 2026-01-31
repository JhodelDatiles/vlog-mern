import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats
} from '../controllers/adminController.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

const router = express.Router();

// All routes require both auth and admin middleware
router.use(auth, admin);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Admin
router.get('/dashboard', getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Admin
router.get('/users/:id', getUser);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Admin
router.put('/users/:id', updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', deleteUser);

export default router;