const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();




// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

// must include'next' function at the end of each middleware app in the MW stack
app.use((req, res, next) => {
    console.log('Hello from the middleware stack!');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})




// 2) Route handlers





// 3) ROUTES

// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter.route('/').get(getAllTours).post(addNewTour);
// tourRouter.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) SERVER START
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});