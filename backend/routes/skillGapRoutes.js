const express = require('express');
const skillGapController = require('../controllers/skillGapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:careerId', protect, skillGapController.analyzeSkillGap);
router.get('/:careerId/courses', protect, skillGapController.suggestCourses);

module.exports = router;