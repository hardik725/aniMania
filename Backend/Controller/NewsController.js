import News from "../Model/News.js";

export const getAllNews = async (req, res) => {
    try {
      const data = await News.find();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
};