import Manga from "../Model/MangaData.js";

// GET: Fetch manga data by name
export const getAllManga = async (req, res) => {
    try {
        // Fetch all manga from the database
        const allManga = await Manga.find({});
        
        // Respond with the list of manga
        res.status(200).json(allManga);
    } catch (error) {
        console.error('Error fetching all manga:', error);
        
        // Respond with an error message
        res.status(500).json({ message: 'Error fetching all manga' });
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