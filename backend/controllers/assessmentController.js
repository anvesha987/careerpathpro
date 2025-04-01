const User = require('../models/User');

exports.saveAssessment = async (req, res) => {
    try {
        const { email, ...assessmentData } = req.body;

        // Update user with assessment data
        const user = await User.findOneAndUpdate(
            { email },
            { 
                ...assessmentData,
                assessmentCompleted: true 
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            success: true,
            message: 'Assessment completed',
            token: 'YOUR_JWT_TOKEN' // Generate and return a real token in production
        });
    } catch (error) {
        res.status(500).json({ message: 'Assessment failed', error: error.message });
    }
};