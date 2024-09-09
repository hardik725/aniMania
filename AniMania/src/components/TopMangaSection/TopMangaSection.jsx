import React from 'react';
import TopMangaList from '../TopMangaList/TopMangaList';

function TopMangaSection() {
    return (
        <div className="container mx-auto px-5 text-center my-5">
            <div className="bg-black text-white text-start backdrop-blur-3xl p-5">
                <h1 className="text-xl font-bold">Top Manga</h1>
                <div className="border-t border-gray-600 mb-4"></div> {/* Thin line with bottom margin */}
                <TopMangaList />
            </div>
        </div>
    );
}

export default TopMangaSection;
