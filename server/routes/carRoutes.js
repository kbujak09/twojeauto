const express = require('express');
const router = express.Router();
const { getCars, getCar, createCar, updateCar, deleteCar } = require('../controllers/carController');
const verifyJWT = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/', getCars);
router.get('/:id', getCar);

// Authentication needed
router.post('/', verifyJWT, upload.array('images', 10), createCar);
router.put('/:id', verifyJWT, upload.array('images', 10), updateCar);
router.delete('/:id', verifyJWT, deleteCar);

module.exports = router;