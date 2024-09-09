import React from "react";
import AnimeCard from "../AnimeCard/AnimeCard";

const TopAnimeList = () => {
    return (
        <div className="flex justify-between gap-4 mr-5">
            {[...Array(6)].map((_, index) => (
                <AnimeCard key={index} rank={index + 1} className="w-[16%] aspect-square" />
            ))}
        </div>
    );
};

export default TopAnimeList;
