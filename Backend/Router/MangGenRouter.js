import express from 'express'
import { GetMangaGenreData } from '../Controller/MangGenreController.js'

const router = express.Router();

router.get('/:genre',GetMangaGenreData);

export default router;