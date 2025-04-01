const Career = require('../models/Career');
const User = require('../models/User');

// Enhanced cosine similarity with skill weights
const cosineSimilarity = (userSkills, careerSkills) => {
  const userSkillSet = new Set(userSkills);
  const intersection = careerSkills.filter(skill => userSkillSet.has(skill));
  
  // Add weight for matching skills (could be enhanced with skill levels)
  const score = intersection.length / Math.sqrt(careerSkills.length * userSkills.length);
  
  return score;
};

exports.recommendCareer = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const careers = await Career.find();
    
    const recommendations = careers
      .map(career => ({
        careerId: career._id,
        title: career.title,
        description: career.description,
        matchScore: cosineSimilarity(user.skills, career.requiredSkills),
        requiredSkills: career.requiredSkills,
        matchingSkills: career.requiredSkills.filter(skill => 
          user.skills.includes(skill)
        ),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return {
      success: true,
      recommendations,
      userSkills: user.skills
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};