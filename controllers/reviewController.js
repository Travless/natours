const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

// Get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  // if request includes a tourId, then set filter to that tourId
  // If request has no included tourId, filter will remain an empty object and filter will return all reviews for all tours
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  // Send Query
  if (!reviews) {
    next(new AppError('No reviews were found'));
  }

  res.status(200).json({
    status: 'succes',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// Create new review
exports.addNewReview = catchAsync(async (req, res, next) => {
  // Allows nested routes
  // if a tour or user was not specified then define either as the one coming from the URL respectively
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);
