import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MangaCard = ({ rank, className }) => {
    const [mangaData, setMangaData] = useState(null);
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
        const fetchMangaData = async () => {
            try {
                const response = await fetch(`https://animania-backend-dmjs.onrender.com/manga/rank/${rank}`);
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
                className={`relative p-4 border rounded-md shadow-lg bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-105`}    
                style={{ 
                    backgroundImage: `url(${mangaData.Photo})`,
                    height: isMobile ? "10rem" : "16rem", // Mobile: 10rem, Desktop: 20rem
                }}
            >
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 rounded-md">
                <h2 className={`font-semibold text-white ${isMobile ? "text-[10px]" : "text-md"}`}>{mangaData.Name}</h2>
                <p className={`text-white ${isMobile ? "text-[10px]" : "text-md"}`}>Rating: {mangaData.Rating}</p>
                </div>
            </div>
        </Link>
    );
};

export default MangaCard;
