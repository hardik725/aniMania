import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const TopAnime = ({ username, onLogout }) => {
    const [animeList, setAnimeList] = useState([]);
    const [userAnimeList, setUserAnimeList] = useState([]);
    const [animeStatuses, setAnimeStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedScores, setSelectedScores] = useState({});

    useEffect(() => {
        const fetchUserAnimeList = async () => {
            if (username) {
                try {
                    const response = await fetch(`http://localhost:4001/User/data/user/${username}/animelist`);
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
            const fetchedAnimeList = [];
            const initialStatuses = {};

            try {
                for (let rank = 1; rank <= 50; rank++) {
                    const response = await fetch(`http://localhost:4001/anime/rank/${rank}`);
                    const data = await response.json();
                    if (data && typeof data === 'object') {
                        fetchedAnimeList.push(data);
                        initialStatuses[data.Name] = true; // Initialize all as true
                    } else {
                        console.error(`Unexpected data format for rank ${rank}:`, data);
                    }
                }

                setAnimeList(fetchedAnimeList);

                // Set animeStatuses to false for those already in userAnimeList
                const updatedStatuses = { ...initialStatuses };
                userAnimeList.forEach(userAnime => {
                    if (updatedStatuses[userAnime.title]) {
                        updatedStatuses[userAnime.title] = false; // Mark as added
                    }
                });

                setAnimeStatuses(updatedStatuses);
            } catch (error) {
                console.error("Error fetching anime list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopAnime();
    }, [userAnimeList]);

    const handleAddToList = async (animeTitle, animeScore) => {
        try {
            const response = await fetch(`http://localhost:4001/User/data/user/${username}/add-anime`, {
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

    if (loading) return <div>Loading...</div>;
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

            {/* Content container */}
            <div className="relative z-10 p-4 backdrop-blur-lg">
                <Navbar username={username} onLogout={onLogout} />
                <div className="container mx-auto mt-5">
                    <table className="min-w-full bg-white/70 backdrop-blur-lg rounded-md">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Rank</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Title</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Score</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animeList.map((anime, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 flex items-center">
                                        <Link to={`/AniDetails/${anime.Name}`}>
                                            <img 
                                                src={anime.Photo} 
                                                alt={anime.Name} 
                                                className="w-12 h-12 object-cover mr-4 transition-transform duration-300 ease-in-out hover:scale-105" 
                                            />
                                        </Link>
                                        <div>
                                            <div className="font-bold text-start">{anime.Name}</div>
                                            <div className="text-gray-500 text-sm text-start">{anime.aired_on}</div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">{anime.Rating}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {animeStatuses[anime.Name] ? (
                                            <>
                                                <button
                                                    className="px-2 py-1 bg-blue-500 text-white rounded"
                                                    onClick={() => handleScoreSubmit(anime.Name)}
                                                >
                                                    Add to list
                                                </button>
                                                <select
                                                    value={selectedScores[anime.Name] || ''}
                                                    onChange={(e) => handleScoreChange(e, anime.Name)}
                                                    className="ml-2 border rounded px-2 py-1"
                                                >
                                                    <option value="">Select score</option>
                                                    {[...Array(10).keys()].map((num) => (
                                                        <option key={num + 1} value={num + 1}>
                                                            {num + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : (
                                            <button className="px-2 py-1 bg-green-500 text-white rounded cursor-not-allowed" disabled>
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
