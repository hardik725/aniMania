import Manga from "../Model/MangaData.js";

// GET: Fetch anime data by name
export const getTopManga = async (req, res) => {
    try {
        console.log("Fetching top 6 Manga by rank...");
        const topManga = await Manga.find().sort({ Rank: 1 }).limit(6);
        console.log("Fetched Manga:", topManga);

        if (topManga && topManga.length > 0) {
            res.status(200).json(topManga);
        } else {
            res.status(404).json({ message: "No Manga data found" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getMangaData = async (req, res) => {
    try {
        const { Name } = req.params;
        const ManData = await Manga.findOne({ Name });

        if (ManData) {
            res.status(200).json(ManData);
        } else {
            res.status(404).json({ message: "Manga data not found" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET: Fetch anime data by rank
export const getMangaByRank = async (req, res) => {
    try {
        const { Rank } = req.params;
        const ManData = await Manga.findOne({ Rank: parseInt(Rank) }); // Convert rank to integer if it's stored as a number

        if (ManData) {
            res.status(200).json(ManData);
        } else {
            res.status(404).json({ message: "Manga data not found" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PUT: Update an existing anime entry
export const updateManga = async (req, res) => {
    try {
        const { Name } = req.params;
        const { newRating } = req.body; // Assuming the new rating is sent in the request body

        const manga = await Anime.findOne({ Name });
        if (!manga) {
            return res.status(404).json({ message: 'Manga not found' });
        }

        manga.Rating = (anime.Rating * anime.TotalUsersWatched + newRating) / (anime.TotalUsersWatched + 1);
        manga.TotalUsersWatched += 1;
        manga.Rank = anime.Rating;

        await manga.save();

        res.status(200).json(manga);
    } catch (error) {
        console.error('Error updating anime:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const searchMangaByName = async (req, res) => {
    const { name } = req.params;
    try {
        // Assuming you have a Mongoose model named 'Anime'
        const mangaList = await Manga.find({ Name: new RegExp(name, 'i') }); // Case-insensitive search
        res.status(200).json(mangaList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};