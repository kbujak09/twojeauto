const express = require('express');
const router = express.Router();
const { getCars, getCar, createCar, updateCar, deleteCar, getUserCars } = require('../controllers/carController');
const verifyJWT = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCars);
router.get('/my', verifyJWT, getUserCars);
router.get('/:id', getCar);

router.post('/', verifyJWT, upload.array('images', 10), createCar);
router.put('/:id', verifyJWT, upload.array('images', 10), updateCar);
router.delete('/:id', verifyJWT, deleteCar);


module.exports = router;