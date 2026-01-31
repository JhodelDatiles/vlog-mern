import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'This username is already taken' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      bio: "" // 🚀 Initializing empty bio
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,        // 🚀 Included
        profilePic: user.profilePic // 🚀 Included
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });  

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,        // 🚀 Included
        profilePic: user.profilePic // 🚀 Included
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile (Used on App Refresh)
// @route   GET /api/auth/me
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,        // 🚀 Included
      profilePic: user.profilePic 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), 
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/' 
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Update user profile data
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    // We use a check for undefined so users can set bio to an empty string if they want
    if (bio !== undefined) user.bio = bio; 

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// @desc    Handle avatar upload
export const uploadAvatar = async (req, res) => {
  try {
    const { url, publicId } = req.body; 
    
    if (!url || !publicId) {
      return res.status(400).json({ message: "No image data provided" });
    }

    const user = await User.findById(req.user.id);

    if (user.profilePicPublicId) {
       await cloudinary.uploader.destroy(user.profilePicPublicId);
    }

    user.profilePic = url;
    user.profilePicPublicId = publicId;
    await user.save();

    res.json({ 
      url: user.profilePic, 
      user: {
        id: user._id,
        username: user.username,
        profilePic: user.profilePic,
        bio: user.bio, // 🚀 Added to keep context intact
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};