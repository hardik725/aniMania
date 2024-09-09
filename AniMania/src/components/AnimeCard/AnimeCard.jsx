import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AnimeCard = ({ rank, className }) => {
    const [animeData, setAnimeData] = useState(null);

    useEffect(() => {
        const fetchAnimeData = async () => {
            try {
                const response = await fetch(`http://localhost:4001/anime/rank/${rank}`);
                if (response.ok) {
                    const data = await response.json();
                    setAnimeData(data);
                } else {
                    console.error("Failed to fetch anime data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchAnimeData();
    }, [rank]);

    if (!animeData) {
        return <div>Loading...</div>;
    }

    return (
        <Link 
            to={`/AniDetails/${animeData.Name}`}
            className={`block ${className}`} 
        >
            <div
                className="relative p-4 border rounded-md shadow-lg bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-105"
                style={{ 
                    backgroundImage: `url(${animeData.Photo})`,
                    height: '300px', // Adjust height as needed
                }}
            >
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 rounded-md">
                    <h2 className="text-md font-bold text-white">{animeData.Name}</h2>
                    <p className="text-white">Rating: {animeData.Rating}</p>
                </div>
            </div>
        </Link>
    );
};

export default AnimeCard;
