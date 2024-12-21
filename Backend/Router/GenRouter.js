import express from 'express'
import { GetGenreData } from '../Controller/GenreController.js'

const router = express.Router();

router.get('/:genre',GetGenreData);

export default router;