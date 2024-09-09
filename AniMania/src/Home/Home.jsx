import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import OptionSec from '../components/OptionSec/OptionSec';
import HeroSection from '../components/HeroSection/HeroSection';
import TopAnimeSection from '../components/TopAnimeSection/TopAnimeSection';
import TopMangaSection from '../components/TopMangaSection/TopMangaSection';

function Home({ username, onLogout }) {
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
      </div>
    </div>
  );
}

export default Home;
