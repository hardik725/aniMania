import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import OptionSec from '../components/OptionSec/OptionSec';
import HeroSection from '../components/HeroSection/HeroSection';
import TopAnimeSection from '../components/TopAnimeSection/TopAnimeSection';
import TopMangaSection from '../components/TopMangaSection/TopMangaSection';
import RomanceSection from '../components/RomanceSection/RomanceSection';
import ActionSection from '../components/ActionSection/ActionSection';
import Loading from '../components/Loading/Loading';
import Footer from '../components/Footer/Footer'

function Home({ username, onLogout }) {
  const [topGenre, setTopGenre] = useState(null);
  const [mangtopGenre, setMangTopGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const allgenre = ['Action','Romance','Comedy','Drama','Fantasy'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserGenreWatched = async () => {
      if (!username) {
        setLoading(false); // No username, nothing to load
        return;
      }

      try {
        const response = await fetch(
          `https://animania-backend-dmjs.onrender.com/user/data/user-data/${username}`
        );
        const userData = await response.json();

        if (response.ok) {
          if (userData.AnimeGenresWatched) {
            const genresArray = Object.entries(userData.AnimeGenresWatched);
            const [topGenreKey] = genresArray.reduce(
              (max, genre) => (genre[1] > max[1] ? genre : max),
              ["", 0]
            );
            setTopGenre(topGenreKey);
          }
          if (topGenre === null) {
            const randomNumber = Math.floor(Math.random() * 5);
            setTopGenre(allgenre[randomNumber]);
          }

          if (userData.MangaGenresRead) {
            const genresArray = Object.entries(userData.MangaGenresRead);
            const [topGenreKey] = genresArray.reduce(
              (max, genre) => (genre[1] > max[1] ? genre : max),
              ["", 0]
            );
            setMangTopGenre(topGenreKey);
          }
          if (mangtopGenre === null) {
            const randomNumber = Math.floor(Math.random() * 5);
            setMangTopGenre(allgenre[randomNumber]);
          }
        } else {
          console.error('Failed to fetch user data or genres are missing.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Set loading to false once data fetching is complete
      }
    };

    fetchUserGenreWatched();
  }, [username]);
  
  if (loading) {
    return <Loading message="Loading Home Page" />;
  }

  return (
    <div className="relative">
      <Navbar username={username} onLogout={onLogout} />
      <HeroSection />
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {isMobile ? (
          <img
            src="https://i.pinimg.com/474x/c1/a9/bd/c1a9bd860cc4aa91f536feb65cb635ba.jpg"
            alt="Mobile Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://motionbgs.com/media/3676/luffy-dark.960x540.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>
      {/* Content */}
      <div className="relative z-10">
        {username && <OptionSec username={username} />}
        <TopAnimeSection />
        <TopMangaSection />
        {topGenre && <RomanceSection genre={topGenre} />}
        {mangtopGenre && <ActionSection genre={mangtopGenre} />}
      </div>
      <Footer/>
    </div>
  );
}

export default Home;
