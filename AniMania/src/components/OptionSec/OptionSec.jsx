import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faList, faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ContactForm from '../ContactForm/ContactForm';

function OptionSec({ username }) {
    const [OptionDropdown, setOptionDropdown] = useState(false);
    const [searchCategory, setSearchCategory] = useState('Anime'); // Default to 'Anime'
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [showContactForm, setShowContactForm] = useState(false);

    // Fetch user's friends list
    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                const response = await fetch(`http://localhost:4001/User/data/user-data/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setFriendsList(userData.friends || []); // Assuming the friends list is under `userData.friends`
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchFriendsList();
    }, [username]);

    const toggleOptionDropdown = () => {
        setOptionDropdown(!OptionDropdown);
    };

    const handleCategorySelect = (category) => {
        setSearchCategory(category);
        setOptionDropdown(false);
    };

    const handleSearch = async () => {
        if (!searchInput.trim()) return;

        try {
            let response;
            if (searchCategory === 'User') {
                response = await fetch(`http://localhost:4001/User/search/${searchInput}`);
            } else if (searchCategory === 'Anime') {
                response = await fetch(`http://localhost:4001/anime/search/${searchInput}`);
            } else if (searchCategory === 'Manga') {
                response = await fetch(`http://localhost:4001/manga/search/${searchInput}`);
            }

            if (!response.ok) {
                throw new Error('Fetch request failed');
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error.message);
            setSearchResults([]);
        }
    };
    const handleContactUsClick = () => {
        setShowContactForm(true);
    };

    const handleCloseContactForm = () => {
        setShowContactForm(false);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showContactForm && !event.target.closest('.contact-form-container')) {
                handleCloseContactForm();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showContactForm]);

    return (
        <div className="flex flex-center flex-wrap mx-auto w-full h-[2.1rem] max-w-[980px] bg-blue-800 relative z-10">
            {/* Options Section */}
            <div className="flex flex-wrap h-full w-1/2 justify-between items-center">
                {/* Anime Menu */}
                <div className="relative group hover:bg-gray-700 h-full w-1/4 flex justify-center items-center">
                    <a href="#" className="font-bold text-base text-white shadow-md tracking-wide uppercase">Anime</a>
                    <div className="absolute left-0 top-full mt-0 w-full bg-white text-gray-700 shadow-lg rounded transform scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200 ease-out">
                        <a href="#" onClick={() => handleCategorySelect('Anime')} className="block px-4 py-3 hover:bg-gray-200">Anime Search</a>
                        <Link to="/topAnime" className="block px-4 py-3 hover:bg-gray-200">Top Anime</Link>
                        <a href="#" className="block px-4 py-3 hover:bg-gray-200">Seasonal Anime</a>
                        <Link to="/MyReviews" className="block px-4 py-3 hover:bg-gray-200">Reviews</Link>
                    </div>
                </div>
                {/* Manga Menu */}
                <div className="relative group hover:bg-gray-700 h-full w-1/4 flex justify-center items-center">
                    <a href="#" className="font-bold text-base text-white shadow-md tracking-wide uppercase">Manga</a>
                    <div className="absolute left-0 top-full mt-0 w-full bg-white text-gray-700 shadow-lg rounded transform scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200 ease-out">
                        <a href="#" onClick={() => handleCategorySelect('Manga')} className="block px-4 py-3 hover:bg-gray-200">Manga Search</a>
                        <Link to="/topManga" className="block px-4 py-3 hover:bg-gray-200">Top Manga</Link>
                        <a href="#" className="block px-4 py-3 hover:bg-gray-200">Ongoing Mangas</a>
                        <Link to="/MyMangaReview" className="block px-4 py-3 hover:bg-gray-200">Reviews</Link>
                    </div>
                </div>
                {/* Industry Menu */}
                <div className="relative group hover:bg-gray-700 h-full w-1/4 flex justify-center items-center">
                    <a href="#" className="font-bold text-base text-white shadow-md tracking-wide uppercase">Industry</a>
                    <div className="absolute left-0 top-full mt-0 w-full bg-white text-gray-700 shadow-lg rounded transform scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200 ease-out">
                        <a href="#" className="block px-4 py-3 hover:bg-gray-200">News</a>
                        <a href="#" className="block px-4 py-3 hover:bg-gray-200">Character</a>
                        <Link to="/MyFriends" className="block px-4 py-3 hover:bg-gray-200">Friends</Link>
                    </div>
                </div>
                {/* Help Menu */}
                <div className="relative group hover:bg-gray-700 h-full w-1/4 flex justify-center items-center">
                    <a href="#" className="font-bold text-base text-white shadow-md tracking-wide uppercase">Help</a>
                    <div className="absolute left-0 top-full mt-0 w-full bg-white text-gray-700 shadow-lg rounded transform scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200 ease-out">
                        <a href="#" className="block px-4 py-3 hover:bg-gray-200">About Us</a>
                        <a href="#" className="block px-4 py-3 hover:bg-gray-200">FAQ</a>
                        <a href="#" onClick={handleContactUsClick} className="block px-4 py-3 hover:bg-gray-200">Contact Us</a>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="relative flex items-center justify-start w-1/2 h-full">
                <div className="relative bg-gray-700 px-2 h-[1.7rem] flex items-center rounded-l-md">
                    <a href="#" onClick={toggleOptionDropdown} className="flex items-center text-white space-x-1">
                        <span className="mr-1 text-sm">{searchCategory}</span>
                        <FontAwesomeIcon
                            icon={OptionDropdown ? faCaretUp : faCaretDown}
                            className="text-sm"
                        />
                    </a>
                    {OptionDropdown && (
                        <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-lg z-20">
                            <div className="bg-gray-700 px-4 py-3 text-white">
                                <h3 className="font-bold">Search Options</h3>
                            </div>
                            <div className="px-4 py-3 text-black">
                                <a href="#" onClick={() => handleCategorySelect('Anime')} className="block py-2">Anime</a>
                                <a href="#" onClick={() => handleCategorySelect('Manga')} className="block py-2">Manga</a>
                                <a href="#" onClick={() => handleCategorySelect('User')} className="block py-2">User</a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center bg-gray-600 h-[1.7rem] rounded-r-md flex-grow relative">
                    <input
                        type="search"
                        className="bg-gray-600 text-sm text-white pl-2 flex-grow h-full focus:outline-none"
                        placeholder="Search Anime, Manga & more..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button className="p-1" onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white" />
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg z-10 max-h-64 overflow-auto">
                        {searchResults.map((result, index) => (
                            <div key={index} className="px-4 py-2">
                                {result.Username && ( // Render user results
                                    <Link
                                        to={`/friendprofile/${result.Username}`}
                                        state={{ isFriend: friendsList.includes(result.Username) }} // Determine if they are friends
                                        className="text-blue-700 hover:underline"
                                    >
                                        {result.Username}
                                    </Link>
                                )}
                                {result.Name && searchCategory === 'Anime' && ( // Render anime results
                                    <Link
                                        to={`/AniDetails/${result.Name}`}
                                        className="text-blue-700 hover:underline"
                                    >
                                        {result.Name}
                                    </Link>
                                )}
                                {result.Name && searchCategory === 'Manga' && ( // Render manga results
                                    <Link
                                        to={`/MangDetails/${result.Name}`}
                                        className="text-blue-700 hover:underline"
                                    >
                                        {result.Name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showContactForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg contact-form-container">
                        <ContactForm onClose={handleCloseContactForm} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default OptionSec;
