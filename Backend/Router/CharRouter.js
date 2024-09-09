

import express from 'express';
import { getCharsByAnimeName } from '../Controller/CharController.js';

const router = express.Router();

// Route to get characters by animeName
router.get('/:animeName', getCharsByAnimeName);

export default router;
