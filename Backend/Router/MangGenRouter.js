import express from 'express'
import { GetGenreData } from '../Controller/MangGenreController.js'

const router = express.Router();

router.get('/:genre',GetGenreData);

export default router;