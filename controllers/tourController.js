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
const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images.', 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// use when file uploads is mixed
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// use upload.single when it is a single file upload, req.file
// use upload.array when uploading multiple files of the same name, req.files

exports.resizeTourImages = catchAsync (async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  console.log(req.files);
  await sharp(req.file.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${imageCoverFileName}`);

  // 2) Images

  next();
});

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

exports.getToursWithin = catchAsync( async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
  }

  const tours = await Tour.find({ 
    // define longitude first then latitude
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } 
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    }
  })
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
  }

  const distances = await Tour.aggregate([
    {
      // only geospacial aggregate stage that exisits, must go first
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      }
    },
    {
      $project: {
        distance: 1,
        name: 1,
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    }
  })
})