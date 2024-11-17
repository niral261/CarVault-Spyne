const express = require('express');
const carController = require('../controllers/carController');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const multer = require("multer");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

router.post('/create', requireAuth(), upload.array("images", 10),carController.createCar);
router.get('/', requireAuth(), carController.getUserCars); 
router.get('/search', requireAuth(), carController.searchCars);


router.get('/:id', carController.getCarById); 
router.put('/:id', requireAuth(), upload.array("images", 10), carController.updateCar); 
router.delete('/:id', carController.deleteCar);

module.exports = router;
