const mongoose = require('mongoose');
require('dotenv').config()

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URL);

// Get the default connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB database');
});

module.exports = mongoose;
