import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

function MyAnimeList({ username , onLogout }) {
    const [UserData, setUserData] = useState([]);
    const [animeDetails, setAnimeDetails] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:4001/User/data/user-data/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);

                    // Sort AnimeList based on user scores in descending order
                    const sortedAnimeList = data.AnimeList.sort((a, b) => b.score - a.score);

                    // Create an array to store sorted user scores
                    const scores = sortedAnimeList.map(({ score }) => score);
                    setUserScores(scores);

                    // Fetch details for each anime title
                    const animePromises = sortedAnimeList.map(({ title }) =>
                        fetch(`http://localhost:4001/anime/${title}`).then(res => res.json())
                    );
                    const animeData = await Promise.all(animePromises);
                    setAnimeDetails(animeData);
                } else {
                    console.error('Failed to fetch user data');
                    setError('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Error fetching user data');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div
            className="relative min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('https://img.freepik.com/free-photo/halloween-scene-illustration-anime-style_23-2151794320.jpg?t=st=1724951751~exp=1724955351~hmac=f512b993560276a62aecf54ed8b0e0839973533b38fc965d44967a88362bd394&w=1800')`,
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
            }}
        >
            <div className="relative z-20 p-4">
            <Navbar username={username} onLogout={onLogout} />
                <div className="container mx-auto mt-5">
                    <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-md">
                        <table className="min-w-full text-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b-2 border-gray-300">Rank</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-300">Title</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-300">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {animeDetails.map((anime, index) => (
                                    <tr key={anime.Name} className="text-center">
                                        <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 flex items-center">
                                        <Link to={`/AniDetails/${anime.Name}`}>
                                                <img src={anime.Photo} alt={anime.Name} className="w-12 h-12 object-cover mr-4" />
                                            </Link>
                                            <div>
                                                <Link to={`/AniDetails/${anime.Name}`} className="font-bold text-start">
                                                    {anime.Name}
                                                </Link>
                                                <div className="text-gray-500 text-sm text-start">{anime.aired_on}</div>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">{userScores[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAnimeList;
