const express = require('express');
const roadmapController = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:careerId', protect, roadmapController.generateRoadmap);
router.patch('/:careerId/progress', protect, roadmapController.updateRoadmapProgress);
router.get('/:careerId/progress', protect, roadmapController.getRoadmapProgress);

module.exports = router;