import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

const TopManga = ({ username, onLogout }) => {
    const [mangaList, setMangaList] = useState([]);
    const [userMangaList, setUserMangaList] = useState([]);
    const [mangaStatuses, setMangaStatuses] = useState({});
    const [selectedScores, setSelectedScores] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserMangaList = async () => {
            if (username) {
                try {
                    const response = await fetch(`http://localhost:4001/User/data/user/${username}/mangalist`);
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
            const fetchedMangaList = [];
            const initialStatuses = {};

            try {
                for (let rank = 1; rank <= 50; rank++) {
                    const response = await fetch(`http://localhost:4001/manga/rank/${rank}`);
                    const data = await response.json();
                    if (data && typeof data === 'object') {
                        fetchedMangaList.push(data);
                        initialStatuses[data.Name] = true; // Initialize all as true
                    } else {
                        console.error(`Unexpected data format for rank ${rank}:`, data);
                    }
                }

                setMangaList(fetchedMangaList);

                const updatedStatuses = { ...initialStatuses };
                userMangaList.forEach(userManga => {
                    if (updatedStatuses[userManga.title]) {
                        updatedStatuses[userManga.title] = false; // Mark as added
                    }
                });

                setMangaStatuses(updatedStatuses);
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
            const response = await fetch(`http://localhost:4001/User/data/user/${username}/add-manga`, {
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

            setUserMangaList(prevList => [...prevList, { title: mangaTitle, score: mangaScore }]);
            setMangaStatuses(prevStatuses => ({ ...prevStatuses, [mangaTitle]: false }));
            setSelectedScores(prevScores => ({ ...prevScores, [mangaTitle]: '' }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!mangaList.length) return <div>No manga data available</div>;

    return (
        <>
            {/* Background Video */}
            <video
                className="fixed inset-0 w-full h-full object-cover z-0"
                src="https://motionbgs.com/media/3272/luffys-resolve-under-the-night-sky.960x540.mp4"
                autoPlay
                loop
                muted
            ></video>

            {/* Content Container */}
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
                            {mangaList.map((manga, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 flex items-center">
                                        <Link to={`/MangDetails/${manga.Name}`}>
                                            <img 
                                                src={manga.Photo} 
                                                alt={manga.Name} 
                                                className="w-12 h-12 object-cover mr-4 transition-transform duration-300 ease-in-out hover:scale-105" 
                                            />
                                        </Link>
                                        <div>
                                            <div className="font-bold text-start">{manga.Name}</div>
                                            <div className="text-gray-500 text-sm text-start">{manga.aired_on}</div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">{manga.Rating}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {mangaStatuses[manga.Name] ? (
                                            <>
                                                <button
                                                    className="px-2 py-1 rounded bg-blue-500 text-white cursor-pointer"
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
                                                    onChange={(e) => setSelectedScores({
                                                        ...selectedScores,
                                                        [manga.Name]: e.target.value
                                                    })}
                                                    className="ml-2"
                                                >
                                                    <option value="" disabled>Score</option>
                                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                                                        <option key={score} value={score}>{score}</option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : (
                                            <button
                                                className="px-2 py-1 rounded bg-green-500 text-white cursor-not-allowed"
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

export default TopManga;
