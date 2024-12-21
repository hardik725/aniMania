import express from "express";
import { getAnimeByRank, getTopAnime, getAnimeData , searchAnimeByName} from "../Controller/AnimeController.js";

const router = express.Router();

router.get("/:Name", getAnimeData);
router.get("/rank/:Rank", getAnimeByRank);
router.get("/top", getTopAnime);
router.get('/search/:name', searchAnimeByName);
// router.post("/update-genres", async (req, res) => {
//     const { animeName, genresList } = req.body;

//     if (!animeName || !genresList || !Array.isArray(genresList)) {
//         return res.status(400).json({ message: "Invalid input. Provide animeName and genresList." });
//     }

//     try {
//         await updateAnimeGenres(animeName, genresList); // Call the function from controller
//         res.status(200).json({ message: `Genres updated for ${animeName}` });
//     } catch (error) {
//         res.status(500).json({ message: `Failed to update genres for ${animeName}: ${error.message}` });
//     }
// });

export default router;
