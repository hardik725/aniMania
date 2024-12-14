import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AnimeCard = ({ rank, className }) => {
    const [animeData, setAnimeData] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Effect to handle screen resizing and toggle views
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchAnimeData = async () => {
            try {
                const response = await fetch(`https://animania-backend-dmjs.onrender.com/anime/rank/${rank}`);
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
                className={`relative p-4 border rounded-md shadow-lg bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-105 ${
                    isMobile ? "h-56" : "h-80"
                }`}
                style={{ 
                    backgroundImage: `url(${animeData.Photo})`,
                }}
            >
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 rounded-md">
                    <h2 className={`font-bold text-white ${isMobile ? "text-xs" : "text-md"}`}>{animeData.Name}</h2>
                    <p className={`text-white ${isMobile ? "text-xs" : "text-md"}`}>Rating: {animeData.Rating}</p>
                </div>
            </div>
        </Link>
    );
};

export default AnimeCard;
