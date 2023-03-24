/* eslint-disable arrow-body-style */
/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/no-useless-path-segments */
// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const catchAsync = require('./../utils/catchAsync');
// eslint-disable-next-line no-unused-vars
const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// GET
// Get list of tour info
exports.getAllTours = factory.getAll(Tour);

// Get tour info by id
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });

// POST
// Add new tour
exports.addNewTour = factory.createOne(Tour);

// PATCH
exports.updateTour = factory.updateOne(Tour);

// DELETE
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY ' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// // Geospacial Query Route
// router.route('/tours-within/:distance/center/:lat,lng/:unit', tourController.getToursWithin);
// // query strings  /tours-distance?distance=233&center=-40,45&unit=mi
// //  /tours-distance/233/center/34.111745,-118.113491/unit/mi

exports.getToursWithin = (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
  }

  console.log(distance, lat, lng, unit);

  res.status(200).json({
    status: 'success',
  })
};