import jwt from "jsonwebtoken";
import User from "../models/user.model.mjs";

const authMiddleware = async (req, res, next) => {
  try {
    //  Get Authorization header
    const authHeader = req.headers.authorization;

    // Format: "Bearer TOKEN"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    //  Extract token
    const token = authHeader.split(" ")[1];

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //  Attach user to request
    req.user = user;

    //  Continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
