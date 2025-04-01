const User = require('../models/User');
const Career = require('../models/Career');

// @desc    Generate career roadmap
// @route   GET /api/roadmap/:careerId
// @access  Private
exports.generateRoadmap = async (req, res) => {
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

    // Get user's current progress for this career
    const currentProgress = user.roadmapProgress?.get(careerId) || [];

    // Generate roadmap steps based on skill gap
    const userSkills = new Set(user.skills);
    const requiredSkills = new Set(career.requiredSkills);
    const missingSkills = [...requiredSkills].filter(skill => !userSkills.has(skill));

    const roadmap = {
      career: {
        _id: career._id,
        title: career.title,
        description: career.description,
      },
      steps: {
        shortTerm: missingSkills.map(skill => ({
          type: 'skill',
          title: `Learn ${skill}`,
          description: `Start learning ${skill} through online courses or tutorials`,
          resources: [
            {
              type: 'course',
              title: `${skill} Fundamentals`,
              provider: 'Coursera',
              link: `https://www.coursera.org/search?query=${skill}`,
            },
          ],
          completed: currentProgress.includes(`learn-${skill.toLowerCase()}`),
        })),
        mediumTerm: [
          {
            type: 'project',
            title: 'Build a portfolio project',
            description: `Create a project using ${career.requiredSkills.join(', ')}`,
            completed: currentProgress.includes('portfolio-project'),
          },
        ],
        longTerm: [
          {
            type: 'job',
            title: 'Apply for jobs',
            description: `Start applying for ${career.title} positions`,
            completed: currentProgress.includes('job-application'),
          },
        ],
      },
      progress: currentProgress.length,
      totalSteps: missingSkills.length + 2, // +2 for project and job steps
    };

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update roadmap progress
// @route   PUT /api/roadmap/:careerId/progress
// @access  Private
exports.updateRoadmapProgress = async (req, res) => {
  try {
    const { careerId } = req.params;
    const { stepId, completed } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize roadmapProgress if it doesn't exist
    if (!user.roadmapProgress) {
      user.roadmapProgress = new Map();
    }

    // Get current progress for this career
    let careerProgress = user.roadmapProgress.get(careerId) || [];

    if (completed) {
      // Add step if not already in progress
      if (!careerProgress.includes(stepId)) {
        careerProgress.push(stepId);
      }
    } else {
      // Remove step if it exists
      careerProgress = careerProgress.filter(step => step !== stepId);
    }

    // Update the progress map
    user.roadmapProgress.set(careerId, careerProgress);
    await user.save();

    res.json({
      progress: careerProgress,
      message: 'Progress updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get roadmap progress
// @route   GET /api/roadmap/:careerId/progress
// @access  Private
exports.getRoadmapProgress = async (req, res) => {
  try {
    const { careerId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progress = user.roadmapProgress?.get(careerId) || [];
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};