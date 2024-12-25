import express from 'express';
import { signUpUser, verifyUser } from '../Controller/TempUserController.js';

const router = express.Router();

// Route for signing up a user
router.post('/signup', signUpUser);

// Route for verifying a user
router.post('/verify', verifyUser);

export default router;
