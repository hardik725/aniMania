import React, { useState, useEffect } from "react";
import MangaCardName from "../MangaCardName/MangaCardName"

const ActionList = ({genre}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed
    const [mangaList, setMangaList] = useState([]);
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
        const fetchMangaList = async () => {
            try {
                const response = await fetch(`https://animania-backend-dmjs.onrender.com/mangenrouter/${genre}`);
                const data = await response.json();
                setMangaList(data.titles); // Assuming data.Romance contains the list of anime titles
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Action genre list:", error);
                setLoading(false);
            }
        };

        fetchMangaList();
    }, []);
    const displayMangaList = mangaList && mangaList.length > 0 ? mangaList.slice(0,(isMobile ? 3 : 6)) : [];

    return (
        <div className="flex justify-between gap-4 mr-5">
            {loading ? (
                <p>Loading...</p> // Display loading message while fetching
            ) : (
                displayMangaList.map((manga) => (
                    <MangaCardName
                        key={manga.title} // Use anime title as the key
                        mangaName={manga.title} // Pass the anime name (title) to AnimeCard
                        className={`aspect-square ${isMobile ? "w-[32%]" : "w-[16%]"}`}
                    />
                ))
            )}
        </div>
    );
};

export default ActionList;
