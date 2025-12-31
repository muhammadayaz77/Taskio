
// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

export const Auth = async (req, res, next) => {
  let token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};
