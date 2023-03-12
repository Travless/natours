const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

// Error handling middleware
module.exports = (err, req, res, next) => {
  // Error stack trace helps locate where the error is within your code
  //   console.log(err.stack);

  // Error code is either what is provided by the error or the default 500 (internal server error)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODDE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
