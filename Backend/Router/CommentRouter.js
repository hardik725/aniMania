import express from 'express'
import { createComment, getCommentsByPost } from '../Controller/CommentController.js'
const router = express.Router();

// Route to create a new comment for a specific post
router.post('/create', createComment);

// Route to fetch all comments for a specific post
router.get('/:postId', getCommentsByPost);

export default router;
