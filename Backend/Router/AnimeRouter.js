import express from "express";
import { getAnimeByRank, getTopAnime, getAnimeData , searchAnimeByName} from "../Controller/AnimeController.js";

const router = express.Router();

router.get("/:Name", getAnimeData);
router.get("/rank/:Rank", getAnimeByRank);
router.get("/top", getTopAnime);
router.get('/search/:name', searchAnimeByName);

export default router;
