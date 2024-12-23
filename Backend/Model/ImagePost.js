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
    required: true,
  },
  Likes: {
    type: [String], // Array of usernames who liked the post
    default: [],
  },
  Comments: {
    type: [
      {
        Username: {
          type: String,
          required: true,
          trim: true,
        },
        Comment: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
}, { Timestamps: true });

const ImagePost = mongoose.model('Post', PostSchema);

export default ImagePost;
