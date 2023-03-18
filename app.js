const express = require('express');
const morgan = require('morgan');
const rateLimit= require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHAndler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// set limiter for additional security for such things like denial of service or brute attacks
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${this._router}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handler that will catch all requests that aren't caught by the designated tour and user handlers
// Operational error
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
// });

// Error handling middleware
app.use(globalErrorHAndler);

module.exports = app;
