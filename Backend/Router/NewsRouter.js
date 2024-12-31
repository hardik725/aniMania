import { getAllNews } from '../Controller/NewsController.js';
import express from 'express';

const router = express.Router();

router.get("/allnews",getAllNews); // router to get all the news

export default router;




