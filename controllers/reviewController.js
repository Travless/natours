// const fs = require('fs');
// const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
// const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');


exports.setTourUserIds = (req, res, next) => {
  // Allows nested routes
  // if a tour or user was not specified then define either as the one coming from the URL respectively
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Create new review
exports.getAllReviews = factory.getAll(Review);

exports.addNewReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.getReview = factory.getOne(Review);
