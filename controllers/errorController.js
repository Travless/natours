// Error handling middleware
module.exports = (err, req, res, next) => {
  // Error stack trace helps locate where the error is within your code
  //   console.log(err.stack);

  // Error code is either what is provided by the error or the default 500 (internal server error)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
