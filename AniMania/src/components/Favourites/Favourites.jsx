import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import Footer from '../Footer/Footer';

function Favourites({ username, onLogout }) {
  const [UserData, setUserData] = useState([]);
  const [favAnime, setFavAnime] = useState([]);
  const [favManga, setFavManga] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://animania-backend-dmjs.onrender.com/user/data/user-data/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          const favanimePromises = data.FavAnime.map(({ title }) =>
            fetch(`https://animania-backend-dmjs.onrender.com/anime/${title}`).then((res) => {
              if (res.ok) return res.json();
              throw new Error(`Failed to fetch anime: ${title}`);
            })
          );
          const favanimeData = await Promise.all(favanimePromises);
          setFavAnime(favanimeData);

          const favmangaPromises = data.FavManga.map(({ title }) =>
            fetch(`https://animania-backend-dmjs.onrender.com/manga/${title}`).then((res) => {
              if (res.ok) return res.json();
              throw new Error(`Failed to fetch manga: ${title}`);
            })
          );
          const favmangaData = await Promise.all(favmangaPromises);
          setFavManga(favmangaData);
        } else {
          console.error('Failed to fetch user data');
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return <Loading message="Loading Favourites" />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar username={username} onLogout={onLogout} />
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-500">Your Favourites</h1>
        <div className="flex flex-col lg:flex-row gap-10">
          {favAnime.length > 0 && (
            <div className="flex-1 bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-pink-400">Favourite Anime</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {favAnime.map((anime) => (
                  <Link
                    to={`/AniDetails/${anime.Name}`}
                    key={anime._id}
                    className="group block transform transition duration-300 hover:scale-105"
                  >
                    <img
                      src={anime.Photo}
                      alt={anime.Name}
                      className={`w-full ${
                        isMobile ? 'h-44' : 'h-56'
                      } object-cover rounded-lg shadow-md`}
                    />
                    <p className="mt-3 text-center text-sm font-semibold text-white group-hover:text-yellow-400">
                      {anime.Name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {favManga.length > 0 && (
            <div className="flex-1 bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-green-400">Favourite Manga</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {favManga.map((manga) => (
                  <Link
                    to={`/MangDetails/${manga.Name}`}
                    key={manga._id}
                    className="group block transform transition duration-300 hover:scale-105"
                  >
                    <img
                      src={manga.Photo}
                      alt={manga.Name}
                      className={`w-full ${
                        isMobile ? 'h-44' : 'h-56'
                      } object-cover rounded-lg shadow-md`}
                    />
                    <p className="mt-3 text-center text-sm font-semibold text-white group-hover:text-yellow-400">
                      {manga.Name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
  
  
}

export default Favourites;
