import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";

const NewsComponent = ({ username, onLogout }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const API_URL = "https://animania-backend-dmjs.onrender.com/news/allnews";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial value and add listener
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-black text-gray-100">
        <div className="flex w-full">
          {/* Left Image */}
          {!isMobile && (
            <div className="flex-shrink-0 w-[20%] sticky top-0 h-screen">
              <img
                src="https://i.pinimg.com/736x/7c/d7/e3/7cd7e371d0fce9571f183308a1946ba3.jpg"
                alt="Decorative Left Border"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* News Content */}
          <div className={`flex-grow shadow-2xl p-4 bg-gray-800 bg-opacity-80 ${isMobile ? "w-full" : "w-[60%]"}`}>
            {loading ? (
              <p className="text-center text-gray-300 text-lg font-medium animate-pulse">
                Loading news...
              </p>
            ) : (
              <div className="space-y-6">
                {news.map((item, index) => (
                  <div
                    key={index}
                    className={`flex flex-col border border-gray-600 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-black ${
                      isMobile ? "p-2 h-auto" : "sm:flex-row p-4 h-[240px]"
                    }`}
                  >
                    <div className={`w-full ${isMobile ? "h-32" : "sm:w-1/3 h-48 sm:h-full"} bg-gray-700`}>
                      <img
                        src={item.Url || "/path-to-news-image.jpg"}
                        alt={item.Title || "News Thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`flex flex-col justify-between ${isMobile ? "p-2" : "p-4 sm:w-2/3"}`}>
                      <h2 className={`font-bold text-white ${isMobile ? "text-sm" : "text-lg"} truncate`}>
                        {item.Title}
                      </h2>
                      <p className={`text-gray-300 mt-2 ${isMobile ? "text-xs" : "text-sm"} overflow-hidden line-clamp-3`}>
                        {item.Content.substring(0, 100)}...
                      </p>
                      <a
                        href={item.Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-blue-400 mt-4 hover:underline ${isMobile ? "text-xs" : "text-sm"}`}
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Image */}
          {!isMobile && (
            <div className="flex-shrink-0 w-[20%] sticky top-0 h-screen">
              <img
                src="https://i.pinimg.com/736x/bf/f3/e0/bff3e01807886da4d08bd053e08e7250.jpg"
                alt="Decorative Right Border"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsComponent;
