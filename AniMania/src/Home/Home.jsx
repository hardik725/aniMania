import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import OptionSec from '../components/OptionSec/OptionSec';
import HeroSection from '../components/HeroSection/HeroSection';
import TopAnimeSection from '../components/TopAnimeSection/TopAnimeSection';
import TopMangaSection from '../components/TopMangaSection/TopMangaSection';
import RomanceSection from '../components/RomanceSection/RomanceSection';
import ActionSection from '../components/ActionSection/ActionSection';

function Home({ username, onLogout }) {
  const [topGenre, setTopGenre] = useState(null);
  const [mangtopGenre, setMangTopGenre] = useState(null);

  useEffect(() => {
    const fetchUserGenreWatched = async () => {
      if (username) {
        try {
          const response = await fetch(
            `https://animania-backend-dmjs.onrender.com/user/data/user-data/${username}`
          );
          const userData = await response.json();

          if (response.ok && userData.AnimeGenresWatched) {
            // Convert the Map object into an array and find the top genre
            const genresArray = Object.entries(userData.AnimeGenresWatched);
            const [topGenreKey] = genresArray.reduce(
              (max, genre) => (genre[1] > max[1] ? genre : max),
              ["", 0] // Initial value: Empty string and 0
            );
            setTopGenre(topGenreKey);
          } else {
            console.error('Failed to fetch user data or genres are missing.');
          }
          if (response.ok && userData.MangaGenresWatched) {
            // Convert the Map object into an array and find the top genre
            const genresArray = Object.entries(userData.MangaGenresWatched);
            const [topGenreKey] = genresArray.reduce(
              (max, genre) => (genre[1] > max[1] ? genre : max),
              ["", 0] // Initial value: Empty string and 0
            );
            setMangTopGenre(topGenreKey);
          } else {
            console.error('Failed to fetch user data or genres are missing.');
          }          
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserGenreWatched();
  }, [username]);

  return (
    <div className="relative">
      <Navbar username={username} onLogout={onLogout} />
      <HeroSection />
      {/* Background Video */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://motionbgs.com/media/3676/luffy-dark.960x540.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>
      {/* Content */}
      <div className="relative z-10">
        {username && <OptionSec username={username} />}
        <TopAnimeSection />
        <TopMangaSection />
        {/* Pass the top genre dynamically */}
        {topGenre && <RomanceSection genre={topGenre} />}
        {mangtopGenre && <ActionSection genre={mangtopGenre} />}
      </div>
    </div>
  );
}

export default Home;
