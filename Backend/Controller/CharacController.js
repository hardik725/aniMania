
import CharacData from "../Model/MangaCharacters.js";

export const getCharsByMangaName = async (req, res) => {
    const { mangaName } = req.params;

    try {
        const characData = await CharacData.findOne({ Name: mangaName });

        if (!characData) {
            return res.status(404).json({ message: 'No data found for the given mangaName.' });
        }

        res.status(200).json(characData.Characters);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Server error while fetching data.' });
    }
};
