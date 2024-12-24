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
  Comments: [
    {
      Username: String,
      Comment: String,
    },
  ]
  ,
}, { Timestamps: true });

const ImagePost = mongoose.model('Post', PostSchema);

export default ImagePost;
