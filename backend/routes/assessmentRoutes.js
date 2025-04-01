const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

router.post('/', assessmentController.saveAssessment);

module.exports = router;