import React, { useState, useEffect } from "react";
import AnimeCardName from "../AnimeCardName/AnimeCardName";

const UpdatedRomanceList = ({ genre }) => {
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
        // Fetch the anime list based on the genre
        const fetchAnimeList = async () => {
            try {
                const response = await fetch(`https://animania-backend-dmjs.onrender.com/genrouter/${genre}`);
                const data = await response.json();
                setAnimeList(data.titles || []); // Assuming data.titles contains the list of anime titles
                setLoading(false);
            } catch (error) {
                console.error("Error fetching anime list:", error);
                setLoading(false);
            }
        };

        fetchAnimeList();
    }, [genre]);

    return (
        <div className="p-4">
            {loading ? (
                <p>Loading...</p> // Display loading message while fetching
            ) : animeList.length > 0 ? (
                <div
                    className={`grid gap-4 ${
                        isMobile ? "grid-cols-3" : "grid-cols-6"
                    }`}
                >
                    {animeList.map((anime) => (
                        <AnimeCardName
                            key={anime.title} // Use a unique key
                            animeName={anime.title} // Pass the anime name (title) to AnimeCard
                            className="aspect-square"
                        />
                    ))}
                </div>
            ) : (
                <p>No anime found for the {genre} genre.</p> // Handle empty list
            )}
        </div>
    );
};

export default UpdatedRomanceList;
