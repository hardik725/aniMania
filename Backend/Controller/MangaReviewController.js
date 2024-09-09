import MangaReview from "../Model/MangaReview.js";

// Route to get all reviews for a specific anime
export const findMangaReview = async (req, res) => {
    try {
      const { mangaName } = req.params;
  
      // Find reviews for the specified anime
      const reviewData = await MangaReview.findOne({ 'ReviewList.mangaName': mangaName });
  
      if (reviewData) {
        // Filter reviews for the specific anime
        const mangaReviews = reviewData.ReviewList.filter(review => review.mangaName === mangaName);
        res.json({ ReviewList: mangaReviews });
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

        // Find all documents where any review in ReviewList has the specified username
        const reviewData = await MangaReview.find({
            'ReviewList.user': username
        });

        // Extract all reviews that match the username
        const userReviews = reviewData.reduce((acc, doc) => {
            const matchingReviews = doc.ReviewList.filter(review => review.user === username);
            return acc.concat(matchingReviews);
        }, []);

        res.json({ ReviewList: userReviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

  

// Route to submit a new review
export const PostReview = async (req, res) => {
    try {
        const { user, mangaName, review } = req.body;

        if (!user || !mangaName || !review) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new review object
        const newReview = { user, mangaName, review };

        // Find existing review data for the specified manga
        let reviewData = await MangaReview.findOne({ 'ReviewList.mangaName': mangaName });

        if (reviewData) {
            // Check if the user has already reviewed this manga
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
            reviewData = new MangaReview({
                ReviewList: [newReview]
            });
        }

        // Save the updated review data
        await reviewData.save();
        res.status(200).json(reviewData);
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Failed to submit review' });
    }
};

