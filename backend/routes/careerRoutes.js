const express = require('express');
const careerController = require('../controllers/careerController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(careerController.getAllCareers)
  .post(protect, admin, careerController.createCareer);

router.route('/:careerId')
  .get(careerController.getCareerById)
  .put(protect, admin, careerController.updateCareer)
  .delete(protect, admin, careerController.deleteCareer);

router.route('/:careerId/skills')
  .patch(protect, admin, careerController.addRequiredSkill)
  .delete(protect, admin, careerController.removeRequiredSkill);

module.exports = router;