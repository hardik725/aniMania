import express from 'express';
import { signUp, Login, Userdata, searchUsersByUsername, updateUser, getUserData, getProfilePictures,
    addToAnimeList, 
    getUserAnimeList, 
    getUserMangaList, 
    addToMangaList, 
    addFriend, 
    removeFriend,
    getMessages,       // Import the new controller function
    postMessage } from '../Controller/userController.js';

const router = express.Router();

// Route for sign up
router.post("/signup", signUp);

// Route for login
router.post("/login", Login);

// Route for fetching user data
router.get('/Userdata/:username', Userdata); // Updated to use `GET` method with `:username` param

// Route for searching user by username
router.get('/search/:searchString', searchUsersByUsername);

router.put("/update/:username",updateUser);

router.get('/data/user-data/:username', getUserData);

// Route to check if anime exists in user list
router.get('/data/user/:username/animelist', getUserAnimeList);

// Route to add anime to list
router.post('/data/user/:username/add-anime', addToAnimeList);

// Route to get manga list
router.get('/data/user/:username/mangalist', getUserMangaList);

// Route to add manga to list
router.post('/data/user/:username/add-manga', addToMangaList);

// Route to add a friend
router.post('/data/addFriend/:username', addFriend);

// Route to remove a friend
router.post('/data/removeFriend/:username', removeFriend);

// Route to get messages between a user and a friend
router.get('/data/user/:username/messages/:friendName', getMessages);

// Route to post a new message from a user to a friend
router.post('/data/user/:username/messages/:friendName', postMessage);

// route to get the profile picture from an array of usernames
router.get('/profilepictures',getProfilePictures);

export default router;
