import passport from "passport";
import dotenv from "dotenv";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";

dotenv.config();

// Extract JWT from cookie
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};

// LOCAL STRATEGY (for login with email/password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use email instead of username
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user
        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // Success
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT STRATEGY (for protected routes)
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor, // Extract from cookie
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;