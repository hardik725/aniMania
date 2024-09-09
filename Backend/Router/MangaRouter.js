import express from "express";
import { getMangaByRank, getTopManga , getMangaData , searchMangaByName } from "../Controller/MangaController.js";

const router = express.Router();

// GET: Fetch anime data by name
router.get("/:Name", getMangaData);


router.get("/rank/:Rank", getMangaByRank);


router.get("/top", getTopManga);

router.get("/search/:name", searchMangaByName);

export default router;
