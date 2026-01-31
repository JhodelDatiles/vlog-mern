import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    // 1. Try to get token from Cookie first, then fallback to Header
    let token = req.cookies?.token;

    if (!token && req.header('Authorization')) {
      token = req.header('Authorization').replace('Bearer ', '');
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Get user (Your logic here is good, it ensures the user still exists in DB)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 4. Attach to request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  } 
};

export default auth;