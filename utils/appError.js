// Global error class
class appError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // use startsWith method to check if statusCode begins with a 4 (returns 'fail') or not (returns 'error')
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // helps keep class from being added to the stack track
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = appError;