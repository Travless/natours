const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// Get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query);
    // .filter()
    // .sort()
    // .limitFields()
    // .paginate();
  const reviews = await features.query;

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
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
