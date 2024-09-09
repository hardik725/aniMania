import Anime from "../Model/AnimeData.js";

// GET: Fetch anime data by name
export const getTopAnime = async (req, res) => {
    try {
        const limit = 50; // Fixed limit of 50 anime
        console.log(`Fetching top ${limit} anime by rank...`);
        
        const topAnime = await Anime.find().sort({ Rank: 1 }).limit(limit);
        console.log("Fetched anime:", topAnime);

        if (topAnime && topAnime.length > 0) {
            res.status(200).json(topAnime);
        } else {
            res.status(404).json({ message: "No anime data found" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





export const getAnimeData = async (req, res) => {
    try {
        const { Name } = req.params;
        const AniData = await Anime.findOne({ Name });

        if (AniData) {
            res.status(200).json(AniData);
        } else {
            res.status(404).json({ message: "Anime data not found" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET: Fetch anime data by rank
export const getAnimeByRank = async (req, res) => {
    try {
        const { Rank } = req.params;
        const AniData = await Anime.findOne({ Rank: parseInt(Rank) }); // Convert rank to integer if it's stored as a number

        if (AniData) {
            res.status(200).json(AniData);
        } else {
            res.status(404).json({ message: "Anime data not found" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PUT: Update an existing anime entry
export const updateAnime = async (req, res) => {
    try {
        const { Name } = req.params;
        const { newRating } = req.body; // Assuming the new rating is sent in the request body

        const anime = await Anime.findOne({ Name });
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        anime.Rating = (anime.Rating * anime.TotalUsersWatched + newRating) / (anime.TotalUsersWatched + 1);
        anime.TotalUsersWatched += 1;
        anime.Rank = anime.Rating;

        await anime.save();

        res.status(200).json(anime);
    } catch (error) {
        console.error('Error updating anime:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const searchAnimeByName = async (req, res) => {
    const { name } = req.params;
    try {
        // Assuming you have a Mongoose model named 'Anime'
        const animeList = await Anime.find({ Name: new RegExp(name, 'i') }); // Case-insensitive search
        res.status(200).json(animeList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

