import jwt from "jsonwebtoken";

export const checkAlreadyLoggedIn = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) return next(); // no token -> continue login normally

  try {
    // verify token
    jwt.verify(token, process.env.JWT_SECRET);
    // if verify success -> token is valid
    return res.status(400).json({ message: "You are already logged in" });
  } catch (err) {
    // token expired or invalid -> allow login
    return next();
  }
};