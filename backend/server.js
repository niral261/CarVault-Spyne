const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./connection/database.js');
const carRoutes = require('./routes/carRoutes');
const multer = require('multer')

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_BASEURL,
}));

app.use(express.json());

connectDB();

const upload = multer({ dest: 'uploads/' });

app.use('/api/cars', upload.array('images'), carRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running successfully on PORT ${PORT}`);
});
