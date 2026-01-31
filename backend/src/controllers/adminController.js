import User from '../models/User.js';
import Post from '../models/Post.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single user (Admin only)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({ author: user._id });

    res.json({
      ...user.toObject(),
      postsCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { username, email, bio, role } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from demoting themselves
    if (req.user.id === user._id.toString() && role === 'user') {
      return res.status(400).json({ message: 'Cannot demote yourself from admin' });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (role) user.role = role;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    // Delete all posts by this user
    await Post.deleteMany({ author: user._id });

    // Delete user
    await user.deleteOne();

    res.json({ message: 'User and all their posts deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get recent users (last 5)
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent posts (last 5)
    const recentPosts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        totalAdmins,
        totalRegularUsers: totalUsers - totalAdmins
      },
      recentUsers,
      recentPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};