
import CharData from "../Model/AnimeCharacters.js"

export const getCharsByAnimeName = async (req, res) => {
    const { animeName } = req.params;

    try {
        const charData = await CharData.findOne({ Name: animeName });

        if (!charData) {
            return res.status(404).json({ message: 'No data found for the given animeName.' });
        }

        res.status(200).json(charData.Characters);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Server error while fetching data.' });
    }
};
