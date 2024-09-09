import Review from '../Model/AnimeReview.js';

// Route to get all reviews for a specific anime
export const findAnimeReview = async (req, res) => {
    try {
      const { animeName } = req.params;
  
      // Find reviews for the specified anime
      const reviewData = await Review.findOne({ 'ReviewList.animeName': animeName });
  
      if (reviewData) {
        // Filter reviews for the specific anime
        const animeReviews = reviewData.ReviewList.filter(review => review.animeName === animeName);
        res.json({ ReviewList: animeReviews });
      } else {
        res.json({ ReviewList: [] }); // No reviews found for the anime
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  };

  export const findUserReview = async (req, res) => {
    try {
      const { username } = req.params;
  
      // Find reviews for the specified user
      const reviewData = await Review.findOne({ 'ReviewList.user': username });
  
      if (reviewData) {
        // Filter reviews written by the specific user
        const userReviews = reviewData.ReviewList.filter(review => review.user === username);
        res.json({ ReviewList: userReviews });
      } else {
        res.json({ ReviewList: [] }); // No reviews found for the user
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};
  

// Route to submit a new review
export const PostReview = async (req, res) => {
  try {
      const { user, animeName, review } = req.body;

      if (!user || !animeName || !review) {
          return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new review object
      const newReview = { user, animeName, review };

      // Find existing review data
      let reviewData = await Review.findOne({ 'ReviewList.animeName': animeName });

      if (reviewData) {
          // Check if the user has already reviewed this anime
          const existingReview = reviewData.ReviewList.find(r => r.user === user);

          if (existingReview) {
              // Update the existing review
              existingReview.review = review;
          } else {
              // Add the new review to the list
              reviewData.ReviewList.push(newReview);
          }
      } else {
          // Create a new review document if none exists
          reviewData = new Review({
              ReviewList: [newReview]
          });
      }

      await reviewData.save();
      res.status(200).json(reviewData);
  } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ message: 'Failed to submit review' });
  }
};


