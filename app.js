const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();




// 1) MIDDLEWARES
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${this._router}/public`))

// must include'next' function at the end of each middleware app in the MW stack
app.use((req, res, next) => {
    console.log('Hello from the middleware stack!');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


// 2) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;