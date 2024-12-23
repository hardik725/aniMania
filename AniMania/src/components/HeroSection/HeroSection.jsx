import React, { useState, useEffect } from 'react';

function HeroSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="mx-auto w-full max-w-full"
      style={{
        backgroundImage: "url('https://i.postimg.cc/FHmRL148/backiee-205922-landscape.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        aspectRatio: isMobile ? '2900 / 959' : '3840 / 959', // Switch aspect ratio based on screen size
      }}
    ></div>
  );
}

export default HeroSection;
