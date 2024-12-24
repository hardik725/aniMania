import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    trim: true,
  },
  Content: {
    type: String,
    required: true,
  },
  PostUrl: {
    type: String,
  },
  Likes: {
    type: [String], // Array of usernames who liked the post
    default: [],
  },
  Comments: { 
    type: [
      {
        username: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      }
    ],
    default: [], // Default to an empty array
  },
}); // Adds `createdAt` and `updatedAt` fields

const ImagePost = mongoose.model('Post', PostSchema);

export default ImagePost;
