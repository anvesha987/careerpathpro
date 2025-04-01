const express = require('express');
const marketInsightController = require('../controllers/marketInsightController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/career/:careerId', protect, marketInsightController.getCareerMarketInsights);
router.get('/location/:location', protect, marketInsightController.getLocationMarketInsights);
router.get('/external', protect, marketInsightController.getExternalMarketInsights);

module.exports = router;