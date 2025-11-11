// middleware/authenticate.js
import passport from "passport";

// Protect routes with JWT
export const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Authentication error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Optional: Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};