

import express from 'express';
import { getCharsByMangaName } from '../Controller/CharacController.js';

const router = express.Router();

// Route to get characters by animeName
router.get('/:mangaName', getCharsByMangaName);

export default router;
