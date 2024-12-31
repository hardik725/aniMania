import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import RomanceSection from '../components/RomanceSection/RomanceSection';
import Footer from '../components/Footer/Footer';

function SeasonalAnime({ username, onLogout }) {
    const [selectedGenre, setSelectedGenre] = useState('Action');
    const [isGenreListOpen, setIsGenreListOpen] = useState(true); // New state to manage mobile genre list visibility

    const genres = ['Action', 'Romance', 'Drama', 'Comedy', 'Fantasy'];

    return (
        <div className="relative h-screen">
            {/* Navbar */}
            <Navbar username={username} onLogout={onLogout} />

            {/* Mobile Genre List Button */}
            <button
                className={`md:hidden fixed top-20 right-4 z-40 bg-gradient-to-r from-blue-500 to-green-500 text-white p-1 rounded-full shadow-md focus:outline-none ${isGenreListOpen ? "hidden" : ""}`}
                onClick={() => setIsGenreListOpen(true)}
            >
                Genres
            </button>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row h-full">
                {/* Genre List Section (Desktop & Mobile Pop-up) */}
                <div
                    className={`md:w-1/5 w-full h-auto md:h-screen bg-gradient-to-b from-blue-900 to-cyan-900 text-white p-4 md:p-6 border-r border-cyan-700 fixed md:static top-0 right-0 z-30 transform ${
                        isGenreListOpen ? 'translate-x-0' : 'translate-x-full'
                    } md:translate-x-0 transition-transform ease-in-out duration-300`}
                >
                    <h2 className="text-xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-center p-2 rounded-lg shadow-md">
                        Genres
                    </h2>
                    <button
                        className="md:hidden absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full focus:outline-none"
                        onClick={() => setIsGenreListOpen(false)}
                    >
                        Close
                    </button>
                    <ul className="space-y-2">
                        {genres.map((genre) => (
                            <li
                                key={genre}
                                className={`cursor-pointer p-3 rounded-lg text-lg font-medium transition-all ${
                                    selectedGenre === genre
                                        ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-gray-900 shadow-lg scale-105'
                                        : 'hover:bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-md text-gray-100'
                                }`}
                                onClick={() => {
                                    setSelectedGenre(genre);
                                    setIsGenreListOpen(false); // Close the genre list after selecting
                                }}
                            >
                                {genre}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content Section */}
                <div className="md:w-4/5 w-full p-4 md:p-6 bg-gray-800 text-white overflow-y-auto">
                    <RomanceSection key={selectedGenre} genre={selectedGenre} />
                </div>
            </div>

            {/* Backdrop for Mobile Genre List */}
            {isGenreListOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsGenreListOpen(false)}
                ></div>
            )}
            <Footer/>
        </div>
    );
}

export default SeasonalAnime;
