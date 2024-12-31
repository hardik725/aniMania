import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import Footer from '../Footer/Footer';

const TopManga = ({ username, onLogout }) => {
    const [mangaList, setMangaList] = useState([]);
    const [userMangaList, setUserMangaList] = useState([]);
    const [mangaStatuses, setMangaStatuses] = useState({});
    const [selectedScores, setSelectedScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []); 
    useEffect(() => {
        const fetchUserMangaList = async () => {
            if (username) {
                try {
                    const response = await fetch(`https://animania-backend-dmjs.onrender.com/user/data/user/${username}/mangalist`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setUserMangaList(data);
                    } else {
                        console.error("Unexpected data format for user manga list:", data);
                    }
                } catch (error) {
                    console.error("Error fetching user manga list:", error);
                }
            }
        };

        fetchUserMangaList();
    }, [username]);

    useEffect(() => {
        const fetchTopManga = async () => {
            try {
              const response = await fetch('https://animania-backend-dmjs.onrender.com/manga/top/all');
              const data = await response.json();  
              if (Array.isArray(data)) {

                const sortedData = data.sort((a, b) => a.Rank - b.Rank);
                
                setMangaList(data);

                // Set initial statuses for anime
                const initialStatuses = {};
                data.forEach(manga => {
                    initialStatuses[manga.Name] = true;
                });

                // Update statuses based on user's anime list
                userMangaList.forEach(userManga => {
                    if (initialStatuses[userManga.title]) {
                        initialStatuses[userManga.title] = false;
                    }
                });

                setMangaStatuses(initialStatuses);
            } else {
                console.error("Unexpected data format for top anime list:", data);
            }
            } catch (error) {
                console.error("Error fetching manga list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopManga();
    }, [userMangaList]);

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

            setUserMangaList(prevList => [...prevList, { title: mangaTitle, score: mangaScore }]);
            setMangaStatuses(prevStatuses => ({ ...prevStatuses, [mangaTitle]: false }));
            setSelectedScores(prevScores => ({ ...prevScores, [mangaTitle]: '' }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div><Loading meassage="Fetching the Top Manga Data"/></div>;
    if (!mangaList.length) return <div>No manga data available</div>;

return (
  <>
      {isMobile ? (
        <img
          src="https://i.pinimg.com/474x/a9/9a/c8/a99ac838fea8a591546b2004a7b05106.jpg"
          alt="Mobile Background"
          className="fixed inset-0 w-full h-full object-cover z-0"
        />
      ) : (
        <img
          src="https://i.pinimg.com/736x/2e/29/87/2e2987941d68cac7c9edd837a913da0e.jpg"
          alt="Desktop Background"
          className="fixed inset-0 w-full h-full object-cover z-0"
        />
      )}

    {/* Content Container */}
    <div className={`relative z-10 ${isMobile ? 'p-2' : 'p-4'} backdrop-blur-lg`}>
      <Navbar username={username} onLogout={onLogout} />
      <div className={`${isMobile ? 'px-2' : 'container mx-auto mt-5'}`}>
        <table
          className={`min-w-full bg-white/70 backdrop-blur-lg rounded-md ${
            isMobile ? 'text-sm' : ''
          }`}
        >
          <thead>
            <tr>
              <th className="py-1 px-2 border-b-2 border-gray-300">Rank</th>
              <th className="py-1 px-2 border-b-2 border-gray-300">Title</th>
              <th className="py-1 px-2 border-b-2 border-gray-300">Score</th>
              <th className="py-1 px-2 border-b-2 border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {mangaList.map((manga, index) => (
              <tr key={index} className="text-center">
<td className="py-2 px-2 h-16 border-b border-gray-200">
  {index + 1}
</td>
<td className="py-2 px-2 h-16 border-b border-gray-200 flex items-center">
  <Link to={`/MangDetails/${manga.Name}`}>
    <img
      src={manga.Photo}
      alt={manga.Name}
      className={`${
        isMobile ? 'w-8 h-8' : 'w-12 h-12'
      } object-cover mr-2 transition-transform duration-300 ease-in-out hover:scale-105`}
    />
  </Link>
  <div>
    <div className={`font-bold text-start ${isMobile ? 'text-xs' : ''}`}>
      {manga.Name.length > 20 ? `${manga.Name.slice(0, 20)}...` : manga.Name}
    </div>
    <div
      className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} text-start`}
    >
      {manga.aired_on}
    </div>
  </div>
</td>
<td className="py-2 px-2 h-16 border-b border-gray-200">
  {manga.Rating}
</td>
<td className="py-2 px-2 h-16 border-b border-gray-200">
  {mangaStatuses[manga.Name] ? (
    <>
      <button
        className={`px-2 py-1 ${isMobile ? 'text-xs' : ''} rounded bg-blue-500 text-white cursor-pointer`}
        onClick={() => {
          const score = selectedScores[manga.Name];
          if (score) {
            handleAddToList(manga.Name, score);
          }
        }}
      >
        Add to list
      </button>
      <select
        value={selectedScores[manga.Name] || ''}
        onChange={(e) =>
          setSelectedScores({
            ...selectedScores,
            [manga.Name]: e.target.value,
          })
        }
        className={`ml-2 ${isMobile ? 'text-xs' : ''}`}
      >
        <option value="" disabled>
          Score
        </option>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <option key={score} value={score}>
            {score}
          </option>
        ))}
      </select>
    </>
  ) : (
    <button
      className={`px-2 py-1 ${isMobile ? 'text-xs' : ''} rounded bg-green-500 text-white cursor-not-allowed`}
      disabled
    >
      Added
    </button>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer/>
    </div>
    
  </>
);

};

export default TopManga;
