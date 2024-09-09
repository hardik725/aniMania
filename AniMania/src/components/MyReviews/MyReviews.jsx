import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

function MyReviews({ username, onLogout }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`http://localhost:4001/review/user/${username}`);
        if (response.ok) {
          const reviewData = await response.json();

          const reviewsWithAnimeData = await Promise.all(
            reviewData.ReviewList.map(async (review) => {
              const animeResponse = await fetch(`http://localhost:4001/anime/${review.animeName}`);
              if (animeResponse.ok) {
                const animeData = await animeResponse.json();
                return {
                  ...review,
                  animePic: animeData.Photo,
                  animeTitle: animeData.Name,
                };
              }
              return review;
            })
          );

          setReviews(reviewsWithAnimeData);
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
      <div className="p">
        <div
          className="h-[calc(100vh-4rem)] overflow-y-auto bg-black bg-cover bg-center p-4 rounded-lg"
          style={{
            backgroundImage: `url('https://img.freepik.com/free-photo/halloween-scene-illustration-anime-style_23-2151794318.jpg?t=st=1725199918~exp=1725203518~hmac=56e3590eac951a1ce8e88faf098b76cd6815ad21d878a464de67f3e71037cc18&w=1800')`,
            backgroundAttachment: 'fixed',
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">User Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-white">No reviews available.</p>
          ) : (
            <div>
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex bg-gray-800/70 p-4 rounded-lg mb-4 h-[15vh] items-center backdrop-blur-sm"
                >
                  <div className="w-1/4 flex justify-center items-center">
                    <Link to={`/AniDetails/${review.animeName}`}>
                      <img
                        src={review.animePic}
                        alt={review.animeName}
                        className="h-full w-1/3 object-contain rounded-lg"
                      />
                    </Link>
                  </div>
                  <div className="w-3/4 ml-4">
                    <h3 className="text-xl font-bold text-white">{review.animeTitle}</h3>
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

export default MyReviews;
