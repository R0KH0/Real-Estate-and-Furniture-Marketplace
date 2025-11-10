import jwt from "jsonwebtoken";

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Read token from httpOnly cookie
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};