const User = require('../models/User');
const Career = require('../models/Career');

// @desc    Analyze skill gap for a user
// @route   GET /api/skill-gap/:userId/:careerId
// @access  Public
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { userId, careerId } = req.params;

    // Find the user and career by their IDs
    const user = await User.findById(userId);
    const career = await Career.findById(careerId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }

    // Get the user's skills and the career's required skills
    const userSkills = new Set(user.skills);
    const requiredSkills = new Set(career.requiredSkills);

    // Find missing skills
    const missingSkills = [...requiredSkills].filter(skill => !userSkills.has(skill));

    // Send response
    res.status(200).json({ missingSkills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze skill gap' });
  }
};

// @desc    Suggest courses to bridge skill gap
// @route   GET /api/skill-gap/:userId/:careerId/courses
// @access  Public
exports.suggestCourses = async (req, res) => {
  try {
    const { userId, careerId } = req.params;

    // Find the user and career by their IDs
    const user = await User.findById(userId);
    const career = await Career.findById(careerId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }

    // Get the user's skills and the career's required skills
    const userSkills = new Set(user.skills);
    const requiredSkills = new Set(career.requiredSkills);

    // Find missing skills
    const missingSkills = [...requiredSkills].filter(skill => !userSkills.has(skill));

    // Example: Map missing skills to courses (this can be replaced with an API call to a course provider)
    const courses = {
      'Python': 'https://www.coursera.org/learn/python',
      'Machine Learning': 'https://www.coursera.org/learn/machine-learning',
      'Data Analysis': 'https://www.coursera.org/learn/data-analysis',
      'SQL': 'https://www.coursera.org/learn/sql-for-data-science',
    };

    const suggestedCourses = missingSkills.map(skill => ({
      skill,
      course: courses[skill] || 'No course found for this skill',
    }));

    // Send response
    res.status(200).json({ suggestedCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to suggest courses' });
  }
};