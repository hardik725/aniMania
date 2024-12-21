import React, { useState, useEffect } from "react";
import AnimeCardName from "../AnimeCardName/AnimeCardName"

const RomanceList = ({genre}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);
    useEffect(() => {
        // Fetch the Romance genre list
        const fetchAnimeList = async () => {
            try {
                const response = await fetch(`https://animania-backend-dmjs.onrender.com/genrouter/${genre}`);
                const data = await response.json();
                setAnimeList(data.titles); // Assuming data.Romance contains the list of anime titles
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Romance genre list:", error);
                setLoading(false);
            }
        };

        fetchAnimeList();
    }, []);
    const displayAnimeList = animeList && animeList.length > 0 ? animeList.slice(0,(isMobile ? 3 : 6)) : [];

    return (
        <div className="flex justify-between gap-4 mr-5">
            {loading ? (
                <p>Loading...</p> // Display loading message while fetching
            ) : (
                displayAnimeList.map((anime) => (
                    <AnimeCardName
                        key={anime.title} // Use anime title as the key
                        animeName={anime.title} // Pass the anime name (title) to AnimeCard
                        className={`aspect-square ${isMobile ? "w-[32%]" : "w-[16%]"}`}
                    />
                ))
            )}
        </div>
    );
};

export default RomanceList;
