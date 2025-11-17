import jwt from "jsonwebtoken";

export const checkAlreadyLoggedIn = (req, res, next) => {
  const token = req.cookies?.jwt;

  // No token  user is not logged in  allow login
  if (!token) return next();

  try {
    // Decode and verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If valid user is logged in
    return res.status(400).json({
      message: "You are already logged in",
      user: {
        id: decoded.id,
        role: decoded.role,
      },
    });

  } catch (err) {
    // Token expired or invalid → allow login
    return next();
  }
};
