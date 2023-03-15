/* eslint-disable arrow-body-style */
/* eslint-disable prettier/prettier */
// refactored try/catch blocks by wrapping async function within catchAsync function
// catchAsync returns new anonymous function which will then be assigned to addNewTour
// When addNewTour request is called, catchAsync will call the function passed in originally (fn)
// and then will execute all the code that is in there. Since it is an async function, it will
// return a promise. That way, in case there is an error, it can be caught via the catch method
// which is included in all promises. That catch method will pass the error into the next() function
// which makes sure that the error endus up in our global middleware.
// This is A LOT to wrap my head around, work on familiarizing yourself with this.
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};