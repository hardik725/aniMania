import Anime from "../Model/AnimeData.js";

// GET: Fetch anime data by name
export const getAllAnime = async (req, res) => {
    try {
        // Fetch all anime from the database
        const allAnime = await Anime.find({});
        
        // Respond with the list of anime
        res.status(200).json(allAnime);
    } catch (error) {
        console.error('Error fetching all anime:', error);
        
        // Respond with an error message
        res.status(500).json({ message: 'Error fetching all anime' });
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
const updateRanks = async () => {
    const animes = await Anime.find().sort({ Rating: -1, TotalUsersWatched: -1 });

    for (let i = 0; i < animes.length; i++) {
        await Anime.findByIdAndUpdate(animes[i]._id, { Rank: i + 1 });
    }
};

export const updateAnime = async (req, res) => {
    try {
        const { Name } = req.params;
        const { newRating } = req.body;

        // Ensure newRating is a number
        const rating = parseFloat(newRating);
        if (isNaN(rating)) {
            return res.status(400).json({ message: 'Invalid rating value' });
        }

        const anime = await Anime.findOne({ Name });
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        // Calculate the new average rating
        const totalRatings = anime.Rating * anime.TotalUsersWatched;
        anime.TotalUsersWatched += 1;
        anime.Rating = (totalRatings + rating) / anime.TotalUsersWatched;

        await anime.save();

        // Update ranks after modifying the anime
        await updateRanks();

        res.status(200).json({ message: 'Anime updated successfully!' });
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
