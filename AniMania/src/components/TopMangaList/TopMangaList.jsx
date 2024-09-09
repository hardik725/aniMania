import React from "react";
import MangaCard from "../MangaCard/MangaCard";

const TopMangaList = () => {
    return (
        <div className="flex justify-between gap-4 mr-5">
            {[...Array(6)].map((_, index) => (
                <MangaCard key={index} rank={index + 1} className="w-[16%] aspect-square" />
            ))}
        </div>
    );
};

export default TopMangaList;