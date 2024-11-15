const Car = require('../model/car');
const fs = require('fs');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

dotenv.config();
const MAX_IMAGES = 10;  
const multerStorage = multer.memoryStorage();  

cloudinary.config({
  cloud_name: 'dur8sqnxd',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const upload = multer({ storage: multerStorage });

exports.createCar = async (req, res) => {
  try {
    if (!req.auth.userId) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    const { title, description, tags } = req.body;
    const uploadedImages = [];
    for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
            const cld_upload_stream = cloudinary.uploader.upload_stream(
                { folder: 'cars' },
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result); 
                }
            );
            fs.createReadStream(file.path).pipe(cld_upload_stream);
        });
    
        uploadedImages.push(result.secure_url);
    }
    console.log("uploadedImages")
    if (uploadedImages.length > MAX_IMAGES) {
      return res.status(400).json({ error: `You can only upload up to ${MAX_IMAGES} images per car.` });
    }

    const car = new Car({
      userId: req.auth.userId,
      title,
      description,
      tags,
      images: uploadedImages,
      createdAt: Date.now(),
    });

    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: 'Error creating car' });
  }
};

exports.updateCar = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const images = req.files; 
        console.log(images);
        const car = await Car.findById(req.params.id);
        if (!car || car.userId.toString() !== req.auth.userId) {
            return res.status(404).json({ error: 'Car not found or unauthorized' });
        }
        if (car.images && car.images.length > 0) {
            await Promise.all(car.images.map(async (imageUrl) => {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }));
        }
        
        const uploadedImages = [];
        for (const file of req.files) {
            const result = await new Promise((resolve, reject) => {
                const cld_upload_stream = cloudinary.uploader.upload_stream(
                    { folder: 'cars' },
                    (err, result) => {
                        if (err) return reject(err);
                        resolve(result); 
                    }
                );
                fs.createReadStream(file.path).pipe(cld_upload_stream);
            });
        
            uploadedImages.push(result.secure_url);
        }

        car.title = title || car.title;
        car.description = description || car.description;
        car.tags = tags || car.tags;
        car.images = uploadedImages;

        await car.save();
        res.status(200).json(car);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating car' });
    }
};



exports.getUserCars = async (req, res) => {
    try {
        const cars = await Car.find({ userId: req.auth.userId }); 
        res.status(200).json(cars);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching cars' });
    }
};

exports.getCarById = async (req, res) => {
  const { id } = req.params; 
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCar = async (req, res) => {
    const { id } = req.params;
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found or unauthorized' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting car' });
    }
};


exports.searchCars = async (req, res) => {
    const { query } = req.query;
    const userId = req.auth.id; 
    
    if (!query || query.trim() === '') {
        return res.status(200).json([]);
    }

    try {
        const cars = await Car.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
            ],
        });
        res.status(200).json(cars);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error searching cars' });
    }
};

  

  