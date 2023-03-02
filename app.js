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




// 3) ROUTES

// app.get('/api/v1/tours', getAllTours);
// get.post('/api/v1/tours', addNewTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(addNewTour);
app.route('/api/v1/tours/:id').get(getTourById).patch(updateTour).delete(deleteTour);




// 4) SERVER START
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});