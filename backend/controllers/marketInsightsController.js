const Career = require('../models/Career.js');
const axios = require('axios');

// @desc    Get job market insights for a specific career
// @route   GET /api/market-insights/career/:careerId
// @access  Public
exports.getCareerMarketInsights = async (req, res) => {
  try {
    const { careerId } = req.params;

    // Find the career by ID
    const career = await Career.findById(careerId);
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }

    // Example: Fetch real-time market insights (replace with actual API calls)
    const marketInsights = {
      careerTitle: career.title,
      salaryRange: career.salaryRange,
      jobMarketDemand: career.jobMarketDemand,
      growthPotential: career.growthPotential,
      trends: [
        'Increasing demand for ' + career.title + ' in tech industries',
        'Remote work opportunities on the rise',
      ],
    };

    // Send response
    res.status(200).json(marketInsights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch market insights' });
  }
};

// @desc    Get job market insights for a specific location
// @route   GET /api/market-insights/location/:location
// @access  Public
exports.getLocationMarketInsights = async (req, res) => {
  try {
    const { location } = req.params;

    // Example: Fetch real-time market insights for the location (replace with actual API calls)
    const marketInsights = {
      location,
      topCareers: [
        { title: 'Software Engineer', demand: 'High', averageSalary: 100000 },
        { title: 'Data Scientist', demand: 'High', averageSalary: 120000 },
        { title: 'Product Manager', demand: 'Medium', averageSalary: 110000 },
      ],
      trends: [
        'Tech industry booming in ' + location,
        'Increased hiring for remote roles',
      ],
    };

    // Send response
    res.status(200).json(marketInsights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch market insights' });
  }
};

// @desc    Get job market insights from an external API (example: LinkedIn or Glassdoor)
// @route   GET /api/market-insights/external
// @access  Public
exports.getExternalMarketInsights = async (req, res) => {
  try {
    // Example: Fetch data from an external API (replace with actual API calls)
    const response = await axios.get('https://api.external-market-insights.com/data', {
      params: {
        location: req.query.location,
        career: req.query.career,
      },
      headers: {
        Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
      },
    });

    // Send response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch external market insights' });
  }
};