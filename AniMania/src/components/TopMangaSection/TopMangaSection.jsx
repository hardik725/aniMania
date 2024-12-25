import React from 'react';
import TopMangaList from '../TopMangaList/TopMangaList';
import { useEffect , useState } from 'react';
function TopMangaSection() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

    return (
        <div className={`relative container mx-auto bg-transparent text-center ${isMobile ? "px-[1px]" : "px-[5px]"}`}>
    <div className="bg-transparent text-white text-start p-5">

                <h1 className="text-xl font-bold">Top Manga</h1>
                <div className="border-t border-gray-600 mb-4"></div> {/* Thin line with bottom margin */}
                <TopMangaList />
            </div>
        </div>
    );
}

export default TopMangaSection;
