const admin = (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default admin;