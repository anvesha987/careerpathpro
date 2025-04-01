const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user (without assessment data)
        const user = new User({
            name,
            email,
            password, // Make sure to hash this in production!
            assessmentCompleted: false
        });

        await user.save();

        res.status(201).json({ 
            success: true,
            message: 'Registration successful',
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};