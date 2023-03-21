const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addNewTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.addNewReview
  );

module.exports = router;

// POST /tour/234552jbkbkj/reviews
// GET /tour/234552jbkbkj/reviews
// GET /tour/234552jbkbkj/reviews/908419034y
