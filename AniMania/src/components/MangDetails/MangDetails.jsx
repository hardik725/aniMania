import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Loading from '../Loading/Loading';

function MangDetails({ username, onLogout }) {
  const { mangaName } = useParams();
  const [manga, setManga] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [selectedScore, setSelectedScore] = useState();
  const [mangaStatus, setMangaStatus] = useState();
  const [favMangaStatus, setFavMangaStatus] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

    // here we will fetch the mangalist of the user 
    useEffect(() => {
      const fetchUserMangaList = async () => {
        if (username) {
          try {
            // Fetch user manga list from the backend
            const response = await fetch(
              `https://animania-backend-dmjs.onrender.com/user/Userdata/${username}`
            );
            const predata = await response.json();
            const data = predata.MangaList;
            const favdata = predata.FavManga;
    
            // Check if the fetched data is an array
            if (Array.isArray(data)) {
              // Search for the mangaName in the list
              const isMangaPresent = data.some(
                (item) => item.title.toUpperCase() === mangaName.toUpperCase() // Case-insensitive check
              );
    
              // Set mangaStatus based on the result
              setMangaStatus(isMangaPresent);
    
              // Log the status for debugging
              if (!isMangaPresent) {
                console.log("Manga is not present in the user's list.");
              } else {
                console.log("Manga is present in the user's list.");
              }
            }else{
              console.error("Unexpected data format for user manga list:", data);
            }
              if(Array.isArray(favdata)){
                // search if it is added to fav manga list or not
                const isMangaFav = favdata.some(
                  (item) => item.title.toUpperCase() === mangaName.toUpperCase() // check if it is fav or not
                );
                setFavMangaStatus(isMangaFav);
  
                //log if manga is not favourite
                if(!isMangaFav){
                  console.log("Manga is not present in the Fav Manga list.");
                }else{
                  console.log("Manga is present in the Fav Manga list.");
                }              
            } else {
              console.error("Unexpected data format for user manga list:", data);
            }
          } catch (error) {
            console.error("Error fetching user manga list:", error);
          }
        }
      };
    
      fetchUserMangaList();
    }, [username, mangaName]); // Dependencies to refetch when username or mangaName changes

    // here the useeffect funtion to add anime to the user animelist
    const handleAddToList = async (mangaTitle, mangaScore) => {
      try {
          const response = await fetch(`https://animania-backend-dmjs.onrender.com/user/data/user/${username}/add-manga`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ mangaTitle, mangaScore })
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              console.error('Error adding manga to list:', errorText);
              throw new Error('Failed to add manga to list');
          }
  
          const data = await response.json();
          console.log('Manga added successfully:', data);

          const newResponse = await fetch(`https://animania-backend-dmjs.onrender.com/manga/update/${mangaTitle}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newRating: mangaScore }) // Include the score in the request body
        });
    
        if (!newResponse.ok) {
            const errorText = await newResponse.text();
            console.error('Error updating manga statistics:', errorText);
            throw new Error('Failed to update manga statistics');
        }
    
        const updateData = await newResponse.json();
        console.log('Manga statistics updated successfully:', updateData); 
  
          // Update the state to reflect that this manga has been added
          setMangaStatus(true); // Assuming manga is successfully added
          setSelectedScore(''); // Reset selected score after adding
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const handleAddToFavList = async (mangaTitle) => {
    try {
      const response = await fetch(
        `https://animania-backend-dmjs.onrender.com/user/addfavmanga/${username}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mangaTitle }),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error adding manga to favorite list:', errorText);
        throw new Error('Failed to add manga to favorite list');
      }
  
      const data = await response.json();
      console.log('Manga added to favorite list successfully:', data);
  
      // Update the state to reflect that this manga has been added to the favorite list
      setFavMangaStatus(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemoveFromFavList = async (mangaTitle) => {
    try {
      const response = await fetch(
        `https://animania-backend-dmjs.onrender.com/user/removefavmanga/${username}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mangaTitle }),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error removing manga from favorite list:', errorText);
        throw new Error('Failed to remove manga from favorite list');
      }
  
      const data = await response.json();
      console.log('Manga removed from favorite list successfully:', data);
  
      // Update the state to reflect that this anime has been removed from the favorite list
      setFavMangaStatus(false);
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
          handleAddToList(mangaName, score); // Add the current manga with the selected score
      }
  };
    // here we will fetch the mangadetails that has to be shown in this component
  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await fetch(`https://animania-backend-dmjs.onrender.com/manga/${mangaName}`);
        if (response.ok) {
          const data = await response.json();
          setManga(data);

          // Fetch character images
          const charactersResponse = await fetch(`https://animania-backend-dmjs.onrender.com/charac/${mangaName}`);
          if (charactersResponse.ok) {
            const charactersData = await charactersResponse.json();
            setCharacters(Array.isArray(charactersData) ? charactersData : []);
          } else {
            throw new Error('Failed to fetch characters');
          }

          // Fetch reviews
          const reviewsResponse = await fetch(`https://animania-backend-dmjs.onrender.com/mangareview/${mangaName}`);
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.ReviewList || []);
          } else {
            throw new Error('Failed to fetch reviews');
          }
        } else {
          throw new Error('Failed to fetch manga details');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching manga details');
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetails();
  }, [mangaName]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('https://animania-backend-dmjs.onrender.com/mangareview/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username,
                mangaName: mangaName,
                review: newReview
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Review submitted successfully:', data);

        // Update the reviews state: replace existing review by the same user or add new one
        setReviews((prevReviews) => {
            const updatedReviews = prevReviews.filter(r => r.user !== username); // Remove old review from the same user
            updatedReviews.push({ user: username, review: newReview }); // Add new/updated review
            return updatedReviews;
        });

        // Clear the review input after submission
        setNewReview("");
    } catch (error) {
        console.error('Failed to submit review:', error);
    }
};


  if (loading) return <div><Loading message="manga details"/></div>;
  if (error) return <div>{error}</div>;
  if (!manga) return <div>No manga data available</div>;

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      {isMobile ? 
      // here we will write about the manga page review when viewing under the mobile 
        <div className="bg-gray-900 text-white p-4">

        {/* First Row: Photo and Name */}
        <div className="flex flex-row  gap-4 bg-gray-800 p-3 rounded-lg">
          <div className="flex-none w-1/2">
            <img 
              src={manga.Photo} 
              alt={manga.Name} 
              className="rounded-lg w-full h-auto"
            />
          </div>
          <div className="flex-grow">
            <h1 className="text-xl font-bold mb-2">{manga.Name}</h1>
            <p><strong>Rating:</strong> {manga.Rating.toFixed(2)} / 10</p>
            <p><strong>Chapters:</strong> {manga.Chapters}</p>
            <p><strong>Rank:</strong> #{manga.Rank}</p>
            <p><strong>Total Users Watched:</strong> {manga.TotalUsersRead}</p>
            <p><strong>Aired On:</strong> {manga.aired_on}</p>
            <div>
            <div className='flex justify-center mt-3'>
            {!mangaStatus ? (
                <>
                  <button
                    className={`px-1 py-1 text-xs bg-pink-500 text-white rounded`}
                    onClick={() => handleScoreSubmit(mangaName)}
                  >
                    Add to list
                  </button>
                  <select
                    value={selectedScore || 'Select Score'}
                    onChange={(e) => handleScoreChange(e, mangaName)}
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
              <div className='flex justify-center mr-3 mt-2'>
              {!favMangaStatus ? (
      <button
      className={`ml-3 px-4 py-2 text-xs font-semibold bg-blue-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
      onClick={() => handleAddToFavList(mangaName)}
    >
      Add to Fav
    </button>
    ):(
    <button
      className={`ml-3 px-4 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400`}
      onClick={() => handleRemoveFromFavList(mangaName)}
    >
      Remove from Fav
    </button>
    )}
              </div>
              </div>           
          </div>
        </div>

        {/* Second Row: Description */}
        <div className="mt-4 bg-gray-800 p-3 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Description</h2>
          <p className="text-sm">{manga.Description}</p>
        </div>

        {/* 3rd row for all the characters in the anime*/}
        <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Characters</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {characters.map((character, index) => (
              <div key={index} className="flex flex-col items-center">
              <img 
              src={character.image} 
              alt={character.name} 
              className="rounded-lg w-full h-auto mb-2" 
              />
              <p className="text-center">{character.name}</p>
              <p className="text-center">{character.role}</p>
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
                    <p><strong>{review.user}</strong>:</p>
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
          <div className="col-span-3">
            <img src={manga.Photo} alt={manga.Name} className="rounded-lg mb-4" />
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Manga Information</h2>
              <p><strong>Chapters:</strong> {manga.Chapters}</p>
              <p><strong>Rank:</strong> #{manga.Rank}</p>
              <p><strong>Total Users Read:</strong> {manga.TotalUsersRead}</p>
              <p><strong>Published On:</strong> {manga.aired_on}</p>
            </div>
            <div className='flex justify-center mt-3 flex-col'>
  {/* First row: Add to list and score */}
  <div className='flex flex-row justify-center'>
    {!mangaStatus ? (
      <>
        <button
          className={`px-2 py-1 ${isMobile ? 'text-xs' : ''} bg-pink-500 text-white rounded`}
          onClick={() => handleScoreSubmit(mangaName)}
        >
          Add to list
        </button>
        <select
          value={selectedScore || 'Select Score'}
          onChange={(e) => handleScoreChange(e, mangaName)}
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

  {/* Second row: Add to favorites */}
  <div className='flex justify-center mt-2'>
    {!favMangaStatus ? (
      <button
      className={`ml-3 px-4 py-2 text-lg font-semibold bg-blue-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
      onClick={() => handleAddToFavList(mangaName)}
    >
      Add to Fav
    </button>
    ):(
    <button
      className={`ml-3 px-4 py-2 text-lg font-semibold bg-red-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400`}
      onClick={() => handleRemoveFromFavList(mangaName)}
    >
      Remove from Fav
    </button>
    )}
  </div>
</div>          
          </div>

          {/* Right Column */}
          <div className="col-span-9">
            <h1 className="text-4xl font-bold mb-4">{manga.Name}</h1>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h2 className="text-2xl font-bold mb-2">Description</h2>
              <p>{manga.Description}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h2 className="text-2xl font-bold mb-2">Rating</h2>
              <p>{manga.Rating.toFixed(2)} / 10</p>
            </div>

            {/* Character Images */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Characters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {characters.map((character, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img src={character.image} alt={character.name} className="rounded-lg w-full h-auto mb-2" />
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
                    <p><strong>{review.user}</strong>:</p>
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

export default MangDetails;
