import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    trim: true,
  },
  UserPhoto: {
    type: String,
    required: true,
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
}); // Adds `createdAt` and `updatedAt` fields

const ImagePost = mongoose.model('Post', PostSchema);

export default ImagePost;
