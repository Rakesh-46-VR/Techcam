const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI);

// Get the default connection
const db = mongoose.connection;

// Event listener for MongoDB connection
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Event listener for MongoDB connection error
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Event listener for MongoDB disconnection
db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Middleware to close MongoDB connection when the application exits
process.on('SIGINT', () => {
  db.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = db;