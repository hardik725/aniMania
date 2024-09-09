import express from "express";
import { findMangaReview , findUserReview , PostReview } from "../Controller/MangaReviewController.js";

const router = express.Router();

// Route to get all reviews for a specific anime
router.get("/:mangaName", findMangaReview);

router.get("/user/:username", findUserReview);
router.post("/post", PostReview);

export default router;
