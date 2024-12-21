import MangGenreData from "../Model/Mang_Genre_wise.js";

export const GetGenreData = async (req, res) => {
    try {
        const { genre } = req.params;  // Get the genre from the URL parameter

        // Find the document where the genre field matches the provided genre
        const genreData = await MangGenreData.findOne({ genre });

        if (genreData) {
            // Send back the titles of the requested genre
            res.status(200).json({ genre: genreData.genre, titles: genreData.Names });
        } else {
            res.status(404).json({ message: `No data found for genre: ${genre}` });
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
