import jwt from "jsonwebtoken";

export const generateToken = (user, expiresIn = "1h") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};