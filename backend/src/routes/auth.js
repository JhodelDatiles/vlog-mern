import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  logout, 
  updateProfile, 
  uploadAvatar 
} from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js'; // The Multer/Cloudinary storage you provided

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Private Routes
router.get('/me', auth, getCurrentUser);
router.post('/logout', logout);

// Profile Update Routes
router.put('/profile', auth, updateProfile);

// Image Upload Route (upload.single('avatar') matches your frontend FormData key)
router.post('/upload-avatar', auth, uploadAvatar);

export default router;