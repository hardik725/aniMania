import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import RomanceSection from '../components/RomanceSection/RomanceSection';

function SeasonalAnime({ username, onLogout }) {
    const [selectedGenre, setSelectedGenre] = useState('Action');

    const genres = ['Action', 'Romance', 'Drama', 'Comedy', 'Fantasy'];

    return (
        <div className="relative h-screen">
            {/* Navbar */}
            <Navbar username={username} onLogout={onLogout} />

            {/* Main Content */}
            <div className="flex flex-col md:flex-row h-full">
                {/* Genre List Section */}
                <div className="md:w-1/5 w-full h-auto md:h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-4 md:p-6 sticky md:top-0 border-r border-indigo-700">
                    <h2 className="text-xl font-bold mb-4 md:mb-6 bg-indigo-700 text-center p-2 rounded-lg shadow-md">
                        Genres
                    </h2>
                    <ul className="space-y-2">
                        {genres.map((genre) => (
                            <li
                                key={genre}
                                className={`cursor-pointer p-3 rounded-lg text-lg font-medium transition-all ${
                                    selectedGenre === genre
                                        ? 'bg-purple-700 shadow-lg scale-105'
                                        : 'hover:bg-purple-600 hover:shadow-md'
                                }`}
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {genre}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Romance Section */}
                <div className="md:w-4/5 w-full p-4 md:p-6 bg-gray-800 text-white overflow-y-auto">
                    {/* Dynamically unmount and remount RomanceSection by using key */}
                    <RomanceSection key={selectedGenre} genre={selectedGenre} />
                </div>
            </div>
        </div>
    );
}

export default SeasonalAnime;
