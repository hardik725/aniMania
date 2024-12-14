import React from "react";
import MangaCard from "../MangaCard/MangaCard";
import { useEffect , useState } from "react";

const TopMangaList = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

    return (
        <div className="flex justify-between gap-4 mr-5">
            {[...Array(isMobile ? 3 : 6)].map((_, index) => (
                <MangaCard key={index} rank={index + 1} className={`aspect-square ${isMobile ? "w-[32%]" : "w-[16%]"}`} />
            ))}
        </div>
    );
};

export default TopMangaList;