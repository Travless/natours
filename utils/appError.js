// Global error class
class AppError extends Error {
  constructor(message, statusCode) {
    // passing message to super basically already sets message to this.message
    super(message);

    this.statusCode = statusCode;
    // use startsWith method to check if statusCode begins with a 4 (returns 'fail') or not (returns 'error')
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // helps keep class from being added to the stack track
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
