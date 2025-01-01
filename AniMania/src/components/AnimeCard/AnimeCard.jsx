import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AnimeCard = ({ rank, className }) => {
    const [animeData, setAnimeData] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Placeholder image URL
    const placeholderImage =
        "https://wallpapers-clan.com/wp-content/uploads/2022/07/anime-default-pfp-2.jpg";

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

    // Fetch anime data based on rank
    useEffect(() => {
        const fetchAnimeData = async () => {
            try {
                const response = await fetch(
                    `https://animania-backend-dmjs.onrender.com/anime/rank/${rank}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setAnimeData(data);
                } else {
                    console.error("Failed to fetch anime data");
                }
            } catch (error) {
                console.error("Error fetching anime data:", error);
            }
        };

        fetchAnimeData();
    }, [rank]);

    // Determine image URL
    const imageUrl = animeData?.Photo || placeholderImage;

    return (
        <Link
            to={animeData ? `/AniDetails/${animeData.Name}` : "#"}
            className={`block ${className}`}
        >
            <div
                className={`relative p-4 border rounded-md shadow-lg bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-105`}
                style={{
                    backgroundImage: `url('${imageUrl}')`,
                    height: isMobile ? "8rem" : "16rem", // Mobile: 10rem, Desktop: 16rem
                }}
            >
                {/* Show Name and Rating only if animeData is loaded */}
                {animeData && (
                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 rounded-md">
                        <h2
                            className={`font-semibold text-white ${
                                isMobile ? "text-[10px]" : "text-md"
                            }`}
                        >
                            {animeData.Name}
                        </h2>
                        <p
                            className={`text-white ${
                                isMobile ? "text-[10px]" : "text-md"
                            }`}
                        >
                            Rating: {animeData.Rating.toFixed(2)}
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default AnimeCard;
