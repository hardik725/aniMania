import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";

const AboutUs = ({ username, onLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Hero Section */}
        <div
          className={`relative flex items-center justify-center h-[50vh] bg-cover bg-center ${
            isMobile
              ? "bg-[url('https://i.pinimg.com/736x/71/33/8b/71338bdc484b87634318fe655ff1ae7c.jpg')]"
              : "bg-[url('https://i.ibb.co/xqZT6y9/photo-2024-12-31-05-39-45.jpg')]"
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <h1 className="text-5xl font-bold z-10 text-center uppercase">
            About <span className="text-indigo-500">AniMania</span>
          </h1>
        </div>

        {/* Content Section */}
        <div className="px-6 md:px-16 lg:px-32 py-12">
          <h2 className="text-4xl font-semibold mb-6 text-indigo-400">Our Story</h2>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="md:w-1/2 text-lg leading-relaxed">
              <p className="mb-4">
                Welcome to <span className="text-indigo-500 font-bold">AniMania</span>, the ultimate hub for anime and
                manga enthusiasts. Born out of pure love for Japanese pop culture, we aim to create a seamless and immersive platform for fans to explore, review, and stay updated on their favorite series.
              </p>
              <p className="text-lg leading-relaxed">
                Founded by <span className="text-indigo-500 font-semibold">Hardik</span>, AniMania is built with passion, creativity, and a vision to connect anime and manga lovers worldwide. Whether you're into shonen, seinen, or slice of life, we've got something for everyone.
              </p>
            </div>
            {/* Author's Image */}
            <div className="mt-3 md:mt-1 md:w-1/3 text-center">
              <img
                src="https://images.pexels.com/photos/30009150/pexels-photo-30009150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual author's image URL
                alt="Author - Hardik"
                className="w-48 h-48 rounded-full border-4 border-indigo-500 shadow-lg mx-auto"
              />
              <h4 className="mt-4 text-xl font-semibold text-indigo-400">Hardik</h4>
              <p className="text-gray-300">Founder & Creator</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-semibold mb-6 text-indigo-400">What Makes AniMania Unique</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {/* Box 1: Account Creation, Profile Editing, and Anime/Manga List */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md w-72">
                <h4 className="text-xl font-bold mb-4">Personalized Experience</h4>
                <p className="text-gray-300">
                  Create your account and customize your profile. Add your favorite anime and manga to your list, track your progress, and rate the series you've watched or read. Manage your personal space with ease by editing your profile anytime.
                </p>
              </div>

              {/* Box 2: Reviews, Ratings, and Forum */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md w-72">
                <h4 className="text-xl font-bold mb-4">Community Engagement</h4>
                <p className="text-gray-300">
                  Share your reviews and ratings for anime and manga. Participate in forums to discuss your thoughts, ask questions, and interact with fellow fans. Your opinions help guide others in discovering the best series.
                </p>
              </div>

              {/* Box 3: Add Friends, Chat, and Stay Connected */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md w-72">
                <h4 className="text-xl font-bold mb-4">Connect with Friends</h4>
                <p className="text-gray-300">
                  Add friends, chat in real-time, and stay connected with others who share your passion for anime and manga. Share recommendations, discuss the latest episodes, and explore new series together in a fun and friendly environment.
                </p>
              </div>

              {/* Box 4 (optional): Optional Feature - Stay Updated */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md w-72">
                <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
                <p className="text-gray-300">
                  Keep track of the latest seasonal releases, new episodes, and trending manga chapters. AniMania ensures you never miss an update on your favorite series.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-6 md:px-16 lg:px-32 py-12">
          <h3 className="text-3xl font-semibold text-indigo-400 mb-4 text-center">Join the AniMania Family</h3>
          <p className="text-lg leading-relaxed text-center mb-8">
            We’re more than just an anime list. AniMania is a community. Dive into discussions, discover hidden gems, and connect with fellow fans.
          </p>
          <div className="text-center">
            <a
              href="/home"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} AniMania. Designed and Developed by Hardik. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutUs;
