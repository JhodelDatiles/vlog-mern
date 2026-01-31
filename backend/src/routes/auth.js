import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  logout, 
  updateProfile, 
  uploadAvatar,
  getUserByUsername // 🚀 Import the new controller function
} from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.get('/user/:username', getUserByUsername); // 🚀 Now using controller

// Private Routes
router.get('/me', auth, getCurrentUser);
router.post('/logout', logout);

// Profile Update Routes
router.put('/profile', auth, updateProfile);

// Image Upload Route
router.post('/upload-avatar', auth, uploadAvatar);

export default router;