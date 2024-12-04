import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {UserDataRoutes , UserRouter} from "./Router/UserRouter.js";
import cors from "cors";
import AnimeRouter from "./Router/AnimeRouter.js";
import MangaRouter from "./Router/MangaRouter.js";
import CharRouter from "./Router/CharRouter.js";
import CharacRouter from "./Router/CharacRouter.js";
import AnimeReviewRouter from "./Router/AnimeReviewRouter.js"; // Ensure correct import path
import MangaReviewRouter from "./Router/MangaReviewRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4001;
const URI = process.env.MongoDBURI;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(URI)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log("ERROR: ", error));

// Routes
app.use("/user", UserRouter);
app.use("/anime", AnimeRouter);
app.use("/manga", MangaRouter);
app.use("/char", CharRouter);
app.use("/charac", CharacRouter);
app.use("/review", AnimeReviewRouter);
app.use("/mangareview", MangaReviewRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
