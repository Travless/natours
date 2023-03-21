const mongoose = require('mongoose');

// review, rating, createdAt, ref to tour, ref to user

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have content.'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be greater than or equal to 1.'],
      max: [5, 'Rating must be less than or equal to 5.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'Review must have a user'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
