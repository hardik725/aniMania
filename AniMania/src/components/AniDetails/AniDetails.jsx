import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';

function AniDetails({ username , onLogout }) {
  const { animeName } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedScore, setSelectedScore] = useState();
  const [newReview, setNewReview] = useState("");
  const [animeStatus, setAnimeStatus] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed

  useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

    useEffect(() => {
      const fetchUserAnimeList = async () => {
        if (username) {
          try {
            // Fetch user anime list from the backend
            const response = await fetch(
              `https://animania-backend-dmjs.onrender.com/user/data/user/${username}/animelist`
            );
            const data = await response.json();
    
            // Check if the fetched data is an array
            if (Array.isArray(data)) {
              // Search for the animeName in the list
              const isAnimePresent = data.some(
                (item) => item.title.toUpperCase() === animeName.toUpperCase() // Case-insensitive check
              );
    
              // Set animeStatus based on the result
              setAnimeStatus(isAnimePresent);
    
              // Log the status for debugging
              if (!isAnimePresent) {
                console.log("Anime is not present in the user's list.");
              } else {
                console.log("Anime is present in the user's list.");
              }
            } else {
              console.error("Unexpected data format for user anime list:", data);
            }
          } catch (error) {
            console.error("Error fetching user anime list:", error);
          }
        }
      };
    
      fetchUserAnimeList();
    }, [username, animeName]); // Dependencies to refetch when username or animeName changes

    // here the useeffect funtion to add anime to the user animelist
    const handleAddToList = async (animeTitle, animeScore) => {
      try {
          const response = await fetch(`https://animania-backend-dmjs.onrender.com/user/data/user/${username}/add-anime`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ animeTitle, animeScore })
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              console.error('Error adding anime to list:', errorText);
              throw new Error('Failed to add anime to list');
          }
  
          const data = await response.json();
          console.log('Anime added successfully:', data);

          const newResponse = await fetch(`https://animania-backend-dmjs.onrender.com/anime/update/${animeTitle}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newRating: animeScore }) // Include the score in the request body
        });
    
        if (!newResponse.ok) {
            const errorText = await newResponse.text();
            console.error('Error updating anime statistics:', errorText);
            throw new Error('Failed to update anime statistics');
        }
    
        const updateData = await newResponse.json();
        console.log('Anime statistics updated successfully:', updateData);
  
          // Update the state to reflect that this anime has been added
          setAnimeStatus(true); // Assuming anime is successfully added
          setSelectedScore(''); // Reset selected score after adding
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const handleScoreChange = (e) => {
      setSelectedScore(e.target.value); // Set the score directly
  };
  
  const handleScoreSubmit = () => {
      const score = selectedScore;
      if (score) {
          handleAddToList(animeName, score); // Add the current anime with the selected score
      }
  };
      
// here there is logic for fetching the anime details

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`https://animania-backend-dmjs.onrender.com/anime/${animeName}`);
        if (response.ok) {
          const data = await response.json();
          setAnime(data);

          // Fetch character images
          const charactersResponse = await fetch(`https://animania-backend-dmjs.onrender.com/char/${animeName}`);
          if (charactersResponse.ok) {
            const charactersData = await charactersResponse.json();
            setCharacters(Array.isArray(charactersData) ? charactersData : []);
            console.log(charactersData);
          } else {
            throw new Error('Failed to fetch characters');
          }

          // Fetch reviews
          const reviewsResponse = await fetch(`https://animania-backend-dmjs.onrender.com/review/${animeName}`);
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.ReviewList || []);
          } else {
            throw new Error('Failed to fetch reviews');
          }
        } else {
          throw new Error('Failed to fetch anime details');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching anime details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeName]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('https://animania-backend-dmjs.onrender.com/review/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: username,
          animeName: animeName,
          review: newReview
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Review submitted successfully:', data);
  
      // Fetch the updated reviews from the backend to reflect changes immediately
      const reviewsResponse = await fetch(`https://animania-backend-dmjs.onrender.com/review/${animeName}`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.ReviewList || []);
      } else {
        throw new Error('Failed to fetch updated reviews');
      }
  
      // Clear the review input after submission
      setNewReview("");
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };
  


  if (loading) return <div><Loading message="Anime Details"/></div>;
  if (error) return <div>{error}</div>;
  if (!anime) return <div>No anime data available</div>;
  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      {
        isMobile ? 
        // mobile application code is here ----
        <div className="bg-gray-900 text-white p-4">

        {/* First Row: Photo and Name */}
        <div className="flex flex-row  gap-4 bg-gray-800 p-3 rounded-lg">
          <div className="flex-none w-1/2">
            <img 
              src={anime.Photo} 
              alt={anime.Name} 
              className="rounded-lg w-full h-auto"
            />
          </div>
          <div className="flex-grow text-sm">
            <h1 className="text-md font-bold mb-2">{anime.Name}</h1>
            <p><strong>Rating:</strong> {anime.Rating.toFixed(2)} / 10</p>
            <p><strong>Episodes:</strong> {anime.episodes}</p>
            <p><strong>Rank:</strong> #{anime.Rank}</p>
            <p><strong>Total Users Watched:</strong> {anime.TotalUsersWatched}</p>
            <p><strong>Aired On:</strong> {anime.aired_on}</p>
            <div className='flex justify-center mt-3'>
            {!animeStatus ? (
                <>
                  <button
                    className={`px-1 py-1 text-xs bg-pink-500 text-white rounded`}
                    onClick={() => handleScoreSubmit(animeName)}
                  >
                    Add to list
                  </button>
                  <select
                    value={selectedScore || 'Select Score'}
                    onChange={(e) => handleScoreChange(e, animeName)}
                    className={`ml-1 border rounded px-1 py-1 text-black`}
                  >
                    <option value="" className='text-black'>Select score</option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <button
                  className={`px-2 text-xl py-1 bg-green-500 text-white rounded cursor-not-allowed`}
                  disabled
                >
                  Added
                </button>
              )}    
              </div>
          </div>
        </div>

        {/* Second Row: Description */}
        <div className="mt-4 bg-gray-800 p-3 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Description</h2>
          <p className="text-sm">{anime.Description}</p>
        </div>

        {/* 3rd row for all the characters in the anime*/}
        <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Characters</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {characters.map((character, index) => (
              <div key={index} className="flex flex-col items-center">
              <img 
              src={character.imageUrl} 
              alt={character.name} 
              className="rounded-lg w-full h-auto mb-2" 
              />
              <p className="text-center">{character.name}</p>
              <p className="text-center">{character.role}</p>
             </div>
             ))}
             </div>
            </div>

        {/* Fourth Row: Reviews */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
              <h2 className="text-2xl font-bold mb-2">Reviews</h2>
              <form onSubmit={handleReviewSubmit} className="mb-4">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="w-full p-2 rounded mb-2 text-black"
                  placeholder="Write your review..."
                  required
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                  Submit Review
                </button>
              </form>

              {/* Display Reviews */}
              <div>
                {reviews.map((review, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded mb-2">
                    <Link to={`/friendprofile/${review.user}`}><p><strong>{review.user}</strong>:</p></Link>
                    <p>{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
      </div>
        :
      <div className="bg-gray-900 text-white p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-2">
            <img src={anime.Photo} alt={anime.Name} className="rounded-lg mb-4" />
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Anime Information</h2>
              <p><strong>Episodes:</strong> {anime.episodes}</p>
              <p><strong>Rank:</strong> #{anime.Rank}</p>
              <p><strong>Total Users Watched:</strong> {anime.TotalUsersWatched}</p>
              <p><strong>Aired On:</strong> {anime.aired_on}</p>
            </div>
            <div className='flex justify-center mt-3'>
            {!animeStatus ? (
                <>
                  <button
                    className={`px-2 py-1 ${
                      isMobile ? 'text-xs' : ''
                    } bg-pink-500 text-white rounded`}
                    onClick={() => handleScoreSubmit(animeName)}
                  >
                    Add to list
                  </button>
                  <select
                    value={selectedScore || 'Select Score'}
                    onChange={(e) => handleScoreChange(e, animeName)}
                    className={`ml-2 border rounded px-2 py-1 text-black`}
                  >
                    <option value="" className='text-black'>Select score</option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <button
                  className={`px-2 text-xl py-1 bg-green-500 text-white rounded cursor-not-allowed`}
                  disabled
                >
                  Added
                </button>
              )}    
              </div>
          </div>

          {/* Right Column */}
          <div className="col-span-10">
            <h1 className="text-4xl font-bold mb-4">{anime.Name}</h1>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h2 className="text-2xl font-bold mb-2">Description</h2>
              <p>{anime.Description}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h2 className="text-2xl font-bold mb-2">Rating</h2>
              <p>{anime.Rating.toFixed(2)} / 10</p>
            </div>

            {/* Character Images */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Characters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {characters.map((character, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img src={character.imageUrl} alt={character.name} className="rounded-lg w-full h-auto mb-2" />
                    <p className="text-center">{character.name}</p>
                    <p className='text-center'>{character.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-gray-800 p-4 rounded-lg mt-4">
              <h2 className="text-2xl font-bold mb-2">Reviews</h2>
              <form onSubmit={handleReviewSubmit} className="mb-4">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="w-full p-2 rounded mb-2 text-black"
                  placeholder="Write your review..."
                  required
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                  Submit Review
                </button>
              </form>

              {/* Display Reviews */}
              <div>
                {reviews.map((review, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded mb-2">
                    <Link to={`/friendprofile/${review.user}`}><p><strong>{review.user}</strong>:</p></Link>
                    <p>{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
}
    </>
  );
}

export default AniDetails;
