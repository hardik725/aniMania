import express from 'express';
import { 
    getUserData, 
    addToAnimeList, 
    getUserAnimeList, 
    getUserMangaList, 
    addToMangaList, 
    addFriend, 
    removeFriend,
    getMessages,       // Import the new controller function
    postMessage        // Import the new controller function
} from '../Controller/UserDataController.js';

const router = express.Router();

// Route to get user data
router.get('/user-data/:username', getUserData);

// Route to check if anime exists in user list
router.get('/user/:username/animelist', getUserAnimeList);

// Route to add anime to list
router.post('/user/:username/add-anime', addToAnimeList);

// Route to get manga list
router.get('/user/:username/mangalist', getUserMangaList);

// Route to add manga to list
router.post('/user/:username/add-manga', addToMangaList);

// Route to add a friend
router.post('/addFriend/:username', addFriend);

// Route to remove a friend
router.post('/removeFriend/:username', removeFriend);

// Route to get messages between a user and a friend
router.get('/user/:username/messages/:friendName', getMessages);

// Route to post a new message from a user to a friend
router.post('/user/:username/messages/:friendName', postMessage);

export default router;
