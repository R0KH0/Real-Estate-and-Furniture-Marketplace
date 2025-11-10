import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";


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

/*// get all users
export const getUser = async (req, res) => {

}*/

// get user by name
