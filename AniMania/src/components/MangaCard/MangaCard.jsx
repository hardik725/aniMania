import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MangaCard = ({ rank, className }) => {
    const [mangaData, setMangaData] = useState(null);

    useEffect(() => {
        const fetchMangaData = async () => {
            try {
                const response = await fetch(`http://localhost:4001/manga/rank/${rank}`);
                if (response.ok) {
                    const data = await response.json();
                    setMangaData(data);
                } else {
                    console.error("Failed to fetch manga data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchMangaData();
    }, [rank]);

    if (!mangaData) {
        return <div>Loading...</div>;
    }

    return (
        <Link 
        to={`/MangDetails/${mangaData.Name}`}
        className={`block ${className}`} 
        >
            <div
                className="relative p-4 border rounded-md shadow-lg bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-105"
                style={{ 
                    backgroundImage: `url(${mangaData.Photo})`,
                    height: '300px', // Adjust height as needed
                }}
            >
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 rounded-md">
                    <h2 className="text-md font-bold text-white">{mangaData.Name}</h2>
                    <p className="text-white">Rating: {mangaData.Rating}</p>
                </div>
            </div>
        </Link>
    );
};

export default MangaCard;
