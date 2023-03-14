/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // token signature requires payload & secret. header is automatuically created, and options are optional
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = (req, res, next) => {
  // read email and password from body
  const { email, password } = req.body;

  // 1) Check if email and passwords actually exisits
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // 2) Check if user exisits and password is correct
  const token = '';
  res.status(200).json({
    status: 'success',
    token,
  });
  // If everything is ok, send token to client
};
