import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

function MyMangaReview({ username, onLogout }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        // Fetch user reviews
        const response = await fetch(`http://localhost:4001/mangareview/user/${username}`);
        if (response.ok) {
          const reviewData = await response.json();

          // Fetch manga data for each review
          const reviewsWithMangaData = await Promise.all(
            reviewData.ReviewList.map(async (review) => {
              const mangaResponse = await fetch(`http://localhost:4001/manga/${review.mangaName}`);
              if (mangaResponse.ok) {
                const mangaData = await mangaResponse.json();
                return {
                  ...review,
                  mangaPic: mangaData.Photo,  // Assuming 'Photo' contains the image URL
                  mangaTitle: mangaData.Name // Fetch manga name if needed
                };
              }
              return review; // Return the review as-is if manga fetch fails
            })
          );

          setReviews(reviewsWithMangaData);
        } else {
          throw new Error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      <div className="relative h-[calc(100vh-4rem)] overflow-y-auto p-4 rounded-lg">
        <video
          className="fixed top-0 left-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted
        >
          <source src="https://motionbgs.com/media/6275/satoru-manga.960x540.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">User Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-white">No reviews available.</p>
          ) : (
            <div>
              {reviews.map((review, index) => (
                <div key={index} className="flex bg-gray-800/70 p-4 rounded-lg mb-4 h-[15vh] items-center backdrop-blur-sm">
                  <div className="w-1/4 flex justify-center items-center">
                    <Link to={`/MangDetails/${review.mangaName}`}>
                      <img
                        src={review.mangaPic}
                        alt={review.mangaName}
                        className="h-full w-1/3 object-contain rounded-lg"
                      />
                    </Link>
                  </div>
                  <div className="w-3/4 ml-4">
                    <h3 className="text-xl font-bold text-white">{review.mangaTitle}</h3>
                    <p className="text-white">{review.review}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyMangaReview;
