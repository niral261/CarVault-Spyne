const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./connection/database.js');
const carRoutes = require('./routes/carRoutes');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream'); // To handle file buffers

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload images to Cloudinary
app.use('/api/cars', upload.array('images'), async (req, res, next) => {
    try {
        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ folder: 'cars' }, (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                });
                Readable.from(file.buffer).pipe(uploadStream);
            });
        });

        const uploadResults = await Promise.all(uploadPromises);

        // Pass uploaded URLs to the next middleware (e.g., carRoutes)
        req.body.imageUrls = uploadResults.map((result) => result.secure_url);
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Image upload failed', error });
    }
});

// Car routes
app.use('/api/cars', carRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running successfully on PORT ${PORT}`);
});
