import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Optional image
  },
  title: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [
      {
        username: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        // Add timestamp for comments if needed
      },
    ],
    default: [],
  },
  content: {
    type: String,
    required: true,
  },
});

export const News = mongoose.models.News || mongoose.model("News", newsSchema);
