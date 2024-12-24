import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  postUrl: { type: String }, // Optional URL for an image or other media
  likes: { type: [String], default: [] }, // Users who liked the post
  comments: { type: [CommentSchema], default: [] },
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;
