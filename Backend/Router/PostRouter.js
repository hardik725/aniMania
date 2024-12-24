import express from 'express';
import { createPost, addComment, getAllPosts } from '../Controller/ImagePostController.js'

const router = express.Router();

// Route to create a new post
router.post('/create', createPost);

// Route to add a comment to a post
router.post('/addcomment/:postId', addComment);

// Route to fetch all posts
router.get('/all', getAllPosts);

export default router;
