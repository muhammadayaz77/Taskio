// middlewares/roleMiddleware.js
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
