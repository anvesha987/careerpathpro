const User = require('../models/User');
const Career = require('../models/Career');

// @desc    Analyze skill gap
// @route   GET /api/skill-gap/:careerId
// @access  Private
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { careerId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const career = await Career.findById(careerId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    const userSkills = new Set(user.skills.map(skill => skill.toLowerCase()));
    const requiredSkills = new Set(
      career.requiredSkills.map(skill => skill.toLowerCase())
    );

    const missingSkills = [...requiredSkills].filter(
      skill => !userSkills.has(skill)
    );
    const matchingSkills = [...requiredSkills].filter(skill =>
      userSkills.has(skill)
    );

    res.json({
      career: career.title,
      userSkills: [...userSkills],
      requiredSkills: [...requiredSkills],
      missingSkills,
      matchingSkills,
      matchPercentage: Math.round(
        (matchingSkills.length / requiredSkills.size) * 100
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suggest courses for missing skills
// @route   GET /api/skill-gap/:careerId/courses
// @access  Private
exports.suggestCourses = async (req, res) => {
  try {
    const { careerId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const career = await Career.findById(careerId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    const userSkills = new Set(user.skills.map(skill => skill.toLowerCase()));
    const requiredSkills = new Set(
      career.requiredSkills.map(skill => skill.toLowerCase())
    );

    const missingSkills = [...requiredSkills].filter(
      skill => !userSkills.has(skill)
    );

    // Course database mock - in a real app, this would come from an external API or database
    const courseDatabase = {
      'javascript': [
        {
          name: 'JavaScript Fundamentals',
          provider: 'Coursera',
          link: 'https://www.coursera.org/learn/javascript',
          duration: '4 weeks',
          level: 'Beginner',
        },
        {
          name: 'Modern JavaScript From The Beginning',
          provider: 'Udemy',
          link: 'https://www.udemy.com/course/modern-javascript',
          duration: '20 hours',
          level: 'Beginner',
        },
      ],
      'python': [
        {
          name: 'Python for Everybody',
          provider: 'Coursera',
          link: 'https://www.coursera.org/specializations/python',
          duration: '8 weeks',
          level: 'Beginner',
        },
      ],
      // Add more skills and courses as needed
    };

    const suggestedCourses = missingSkills.map(skill => ({
      skill,
      courses: courseDatabase[skill] || [
        {
          name: `${skill} Course`,
          provider: 'Various',
          link: `https://www.google.com/search?q=${skill}+course`,
          duration: 'Varies',
          level: 'Beginner',
        },
      ],
    }));

    res.json({
      career: career.title,
      suggestions: suggestedCourses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};