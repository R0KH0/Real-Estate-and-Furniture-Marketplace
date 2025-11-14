import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { generateToken } from "../Utils/generateToken.js";


// login user (using Passport Local Strategy)
export const loginUser = (req, res, next) => {
  // Input validation
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Passport authenticate
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "An error occurred during login" });
    }

    if (!user) {
      return res.status(401).json({ message: info?.message || "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);
    
    // Set httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    // Send response
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })(req, res, next);
};

// LOGOUT USER
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  
  res.json({ message: "Logout successful" });
};

//create user
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        //check for missing fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        // password complexity validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one letter, one number, and one special character' });
        }

        // check password length
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    }catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//find users
export const findUsers = async (req, res) => {
  try {
    const { query } = req.query; // e.g. ?query=john
    if (!query) return res.status(400).json({ message: "Please provide a search query" });

    let users;

    if (req.user.role === "admin") {
      // Admin can search by email OR name
      users = await User.find({
        $or: [
          { email: { $regex: query, $options: "i" } },
          { name: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      // Non-admin users can search by name only
      users = await User.find({
        name: { $regex: query, $options: "i" },
      }).select("-password");
    }

    res.status(200).json({ results: users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// update user details
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "User updated successfully",
      user: updated,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

