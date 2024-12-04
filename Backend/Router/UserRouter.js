import express from 'express';
import { signUp, Login, Userdata, searchUsersByUsername, updateUser} from '../Controller/userController.js';
import UserDataRoutes from './UserDataRoutes.js'; // Import the new routes

const router = express.Router();

// Route for sign up
router.post("/signup", signUp);

// Route for login
router.post("/login", Login);

// Use the new user data routes
router.use('/data', UserDataRoutes);

// Route for fetching user data
router.get('/Userdata/:username', Userdata); // Updated to use `GET` method with `:username` param

// Route for searching user by username
router.get('/search/:searchString', searchUsersByUsername);

router.put("/update/:username",updateUser);



export default router;
