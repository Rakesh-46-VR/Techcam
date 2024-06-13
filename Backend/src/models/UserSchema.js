const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;