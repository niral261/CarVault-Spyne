
const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./connection/database.js');
const carRoutes = require('./routes/carRoutes.js');

dotenv.config();

const app = express();

app.use(cors({ origin: 'https://car-vault-spyne-7kwj.vercel.app' }));
app.use(express.json());

connectDB();

app.use('/api/cars', carRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running successfully on PORT ${PORT}`);
});
