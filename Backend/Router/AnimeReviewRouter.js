import express from "express";
import { findAnimeReview, PostReview, findUserReview } from "../Controller/AnimeReviewController.js"; // Correct path to your controller file

const router = express.Router();

// Route to get all reviews for a specific anime
router.get("/:animeName", findAnimeReview);

router.get("/user/:username", findUserReview);
router.post("/post", PostReview);

export default router;
