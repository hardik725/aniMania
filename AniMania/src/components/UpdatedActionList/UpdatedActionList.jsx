import React, { useState, useEffect } from "react";
import MangaCardName from "../MangaCardName/MangaCardName";

const UpdatedActionList = ({ genre }) => {
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
        // Fetch the manga list based on the genre
        const fetchMangaList = async () => {
            try {
                const response = await fetch(`https://animania-backend-dmjs.onrender.com/mangenrouter/${genre}`);
                const data = await response.json();
                setMangaList(data.titles || []); // Assuming data.titles contains the list of manga titles
                setLoading(false);
            } catch (error) {
                console.error("Error fetching manga list:", error);
                setLoading(false);
            }
        };

        fetchMangaList();
    }, [genre]);

    return (
        <div className="p-4">
            {loading ? (
                <p>Loading...</p> // Display loading message while fetching
            ) : mangaList.length > 0 ? (
                <div
                    className={`grid gap-4 ${
                        isMobile ? "grid-cols-3" : "grid-cols-5"
                    }`}
                >
                    {mangaList.map((manga) => (
                        <MangaCardName
                            key={manga.title} // Use a unique key
                            mangaName={manga.title} // Pass the manga name (title) to MangaCard
                            className="aspect-square"
                        />
                    ))}
                </div>
            ) : (
                <p>No Manga found for the {genre} genre.</p> // Handle empty list
            )}
        </div>
    );
};

export default UpdatedActionList;
