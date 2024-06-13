const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment = new mongoose.Schema({
    username:{type: String},
    cUserId:{type: String},
    comment:{type:String},
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type:Number, default:0},
    likedBy: { 
        user_Id : {
            type:Array,
            required:false,
            default : []
        }
    },
    comments: [comment],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define the schema
const dataSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },

    post: [postSchema]
});

// Create a model
const Data = mongoose.model('Data', dataSchema);

// Export the model
module.exports = {Data , postSchema};