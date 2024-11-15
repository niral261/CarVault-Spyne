const express = require('express');
const carController = require('../controllers/carController');
const router = express.Router();
const { requireAuth } = require('@clerk/express');

router.post('/create', requireAuth(),carController.createCar); 
router.get('/', requireAuth(),carController.getUserCars); 
router.get('/search', requireAuth(),carController.searchCars);
router.get('/:id', carController.getCarById); 
router.put('/:id', requireAuth(),carController.updateCar); 
router.delete('/:id', carController.deleteCar);

module.exports = router;
