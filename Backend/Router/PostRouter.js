import express from 'express';
import { createPost, likePost, getAllPosts } from '../Controller/ImagePostController.js';

const router = express.Router();

// Routes
router.post("/createpost", createPost); // Route to create a new post
router.post("/addlike/:postId", likePost); // Route to like a post
router.get("/allpost", getAllPosts); // Route to get all posts

export default router;
