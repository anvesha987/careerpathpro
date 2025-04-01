const Career = require('../models/Career.js');

// @desc    Create a new career
// @route   POST /api/career
// @access  Public
exports.createCareer = async (req, res) => {
  try {
    const { title, description, requiredSkills, salaryRange, jobMarketDemand, growthPotential } = req.body;

    // Create a new career
    const newCareer = new Career({
      title,
      description,
      requiredSkills,
      salaryRange,
      jobMarketDemand,
      growthPotential,
    });

    // Save the career to the database
    const savedCareer = await newCareer.save();

    // Send response
    res.status(201).json(savedCareer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create career' });
  }
};

// @desc    Get career by ID
// @route   GET /api/career/:careerId
// @access  Public
exports.getCareerById = async (req, res) => {
  try {
    const { careerId } = req.params;

    // Find the career by ID
    const career = await Career.findById(careerId);

    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }

    // Send response
    res.status(200).json(career);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch career' });
  }
};

// @desc    Update career by ID
// @route   PUT /api/career/:careerId
// @access  Public
exports.updateCareer = async (req, res) => {
  try {
    const { careerId } = req.params;
    const { title, description, requiredSkills, salaryRange, jobMarketDemand, growthPotential } = req.body;

    // Find the career by ID and update
    const updatedCareer = await Career.findByIdAndUpdate(
      careerId,
      { title, description, requiredSkills, salaryRange, jobMarketDemand, growthPotential },
      { new: true } // Return the updated career
    );

    if (!updatedCareer) {
      return res.status(404).json({ error: 'Career not found' });
    }

    // Send response
    res.status(200).json(updatedCareer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update career' });
  }
};

// @desc    Delete career by ID
// @route   DELETE /api/career/:careerId
// @access  Public
exports.deleteCareer = async (req, res) => {
  try {
    const { careerId } = req.params;

    // Find the career by ID and delete
    const deletedCareer = await Career.findByIdAndDelete(careerId);

    if (!deletedCareer) {
      return res.status(404).json({ error: 'Career not found' });
    }

    // Send response
    res.status(200).json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete career' });
  }
};

// @desc    Get all careers
// @route   GET /api/career
// @access  Public
exports.getAllCareers = async (req, res) => {
  try {
    // Fetch all careers from the database
    const careers = await Career.find();

    // Send response
    res.status(200).json(careers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
};

// @desc    Add a required skill to a career
// @route   PATCH /api/career/:careerId/skills
// @access  Public
exports.addRequiredSkill = async (req, res) => {
  try {
    const { careerId } = req.params;
    const { skill } = req.body;

    // Find the career by ID and add the skill
    const career = await Career.findById(careerId);
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }

    career.requiredSkills.push(skill);
    const updatedCareer = await career.save();

    // Send response
    res.status(200).json(updatedCareer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add required skill' });
  }
};

// @desc    Remove a required skill from a career
// @route   DELETE /api/career/:careerId/skills/:skill
// @access  Public
exports.removeRequiredSkill = async (req, res) => {
  try {
    const { careerId, skill } = req.params;

    // Find the career by ID and remove the skill
    const career = await Career.findById(careerId);
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }

    career.requiredSkills = career.requiredSkills.filter(s => s !== skill);
    const updatedCareer = await career.save();

    // Send response
    res.status(200).json(updatedCareer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove required skill' });
  }
};