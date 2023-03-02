const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

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

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);





// 2) Route handlers
// GET
// Get list of tour info
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
};

// Get tour info by id
const getTourById = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
};

// POST
// Add new tour
const addNewTour = (req, res) => {

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
};

// PATCH
const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    });
};

// DELETE
const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
};



const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This route is not yet defined'
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This route is not yet defined'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This route is not yet defined'
    })
}


const updateUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This route is not yet defined'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This route is not yet defined'
    })
}

// 3) ROUTES

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(addNewTour);
tourRouter.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) SERVER START
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});