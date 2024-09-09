import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

function MyMangaList({ username , onLogout }) {
    const [UserData, setUserData] = useState([]);
    const [mangaDetails, setMangaDetails] = useState([]);
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

                    // Create and sort MangaList based on score
                    const sortedMangaList = data.MangaList.sort((a, b) => b.score - a.score);

                    // Create an array to store user scores
                    const scores = sortedMangaList.map(({ score }) => score);
                    setUserScores(scores);

                    const mangaPromises = sortedMangaList.map(({ title }) =>
                        fetch(`http://localhost:4001/manga/${title}`).then(res => res.json())
                    );
                    const mangaData = await Promise.all(mangaPromises);
                    setMangaDetails(mangaData);
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
                backgroundImage: `url('https://img.freepik.com/free-photo/anime-moon-landscape_23-2151645914.jpg?t=st=1724953611~exp=1724957211~hmac=5b612dc41151b0f26c0e4a4139258e23989224b5c1e8ed5036dd620a8a8082b6&w=1800')`,
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
                                {mangaDetails.map((manga, index) => (
                                    <tr key={manga.Name} className="text-center">
                                        <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 flex items-center">
                                        <Link to={`/MangDetails/${manga.Name}`}>
                                                <img src={manga.Photo} alt={manga.Name} className="w-12 h-12 object-cover mr-4" />
                                            </Link>
                                            <div>
                                                <Link to={`/MangDetails/${manga.Name}`} className="font-bold text-start">
                                                    {manga.Name}
                                                </Link>
                                                <div className="text-gray-500 text-sm text-start">{manga.aired_on}</div>
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

export default MyMangaList;
