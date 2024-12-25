import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Loading from '../Loading/Loading';

const TopAnime = ({ username, onLogout }) => {
    const [animeList, setAnimeList] = useState([]);
    const [userAnimeList, setUserAnimeList] = useState([]);
    const [animeStatuses, setAnimeStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedScores, setSelectedScores] = useState({});
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
                    const response = await fetch(`https://animania-backend-dmjs.onrender.com/user/data/user/${username}/animelist`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setUserAnimeList(data);
                    } else {
                        console.error("Unexpected data format for user anime list:", data);
                    }
                } catch (error) {
                    console.error("Error fetching user anime list:", error);
                }
            }
        };

        fetchUserAnimeList();
    }, [username]);

    useEffect(() => {
        const fetchTopAnime = async () => {
            try {
                const response = await fetch('https://animania-backend-dmjs.onrender.com/anime/top/all');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setAnimeList(data);

                    // Set initial statuses for anime
                    const initialStatuses = {};
                    data.forEach(anime => {
                        initialStatuses[anime.Name] = true;
                    });

                    // Update statuses based on user's anime list
                    userAnimeList.forEach(userAnime => {
                        if (initialStatuses[userAnime.title]) {
                            initialStatuses[userAnime.title] = false;
                        }
                    });

                    setAnimeStatuses(initialStatuses);
                } else {
                    console.error("Unexpected data format for top anime list:", data);
                }
            } catch (error) {
                console.error("Error fetching top anime list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopAnime();
    }, [userAnimeList]);

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

            setUserAnimeList(prevList => [...prevList, { title: animeTitle, score: animeScore }]);
            setAnimeStatuses(prevStatuses => ({ ...prevStatuses, [animeTitle]: false }));
            setSelectedScores(prevScores => ({ ...prevScores, [animeTitle]: '' }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleScoreChange = (e, animeTitle) => {
        setSelectedScores(prevScores => ({ ...prevScores, [animeTitle]: e.target.value }));
    };

    const handleScoreSubmit = (animeTitle) => {
        const score = selectedScores[animeTitle];
        if (score) {
            handleAddToList(animeTitle, score);
        }
    };

    if (loading) return <div><Loading message="Fetching the Top Anime Data"/></div>;
    if (!animeList.length) return <div>No anime data available</div>;

    return (
<>
    {/* Background Video */}
    <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://motionbgs.com/media/1194/vegeta-ultra-ego.960x540.mp4"
        autoPlay
        loop
        muted
    ></video>

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
                    <tr className={`${isMobile ? 'h-10' : 'h-14'}`}>
                        <th className="py-1 px-2 border-b-2 border-gray-300">Rank</th>
                        <th className="py-1 px-2 border-b-2 border-gray-300">Title</th>
                        <th className="py-1 px-2 border-b-2 border-gray-300">Score</th>
                        <th className="py-1 px-2 border-b-2 border-gray-300">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {animeList.map((anime, index) => (
                        <tr
                            key={index}
                            className={`text-center ${isMobile ? 'h-16' : 'h-20'} border-b`}
                        >
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
    </div>
</>

    );
};

export default TopAnime;
