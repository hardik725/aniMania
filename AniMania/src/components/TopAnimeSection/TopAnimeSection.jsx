import React from 'react';
import TopAnimeList from '../TopAnimeList/TopAnimeList';

function TopAnimeSection() {
    return (
        <div className="relative container mx-auto px-5 text-center">
            <div className="bg-black text-white text-start backdrop-blur-3xl p-5">
                <h1 className="text-xl font-bold">Top Anime</h1>
                <div className="border-t border-gray-600 mb-4"></div> {/* Thin line with bottom margin */}
                <TopAnimeList />
            </div>
        </div>
    );
}

export default TopAnimeSection;
