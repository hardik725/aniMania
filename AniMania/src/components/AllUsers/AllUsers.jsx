import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";

const AllUsers = ({ username, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const API_URL = "https://animania-backend-dmjs.onrender.com/user/alluser";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-purple-900 to-black text-gray-100">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text animate-pulse">
            Meet the Community
          </h1>
          {loading ? (
            <p className="text-center text-xl text-gray-300 animate-pulse">
              Loading community members...
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {users.map((user, index) => (
                <Link
                to={
                  user.Username === username 
                    ? "/profile" 
                    : `/friendprofile/${user.Username}`
                }
                key={index}
                className="group"
              >
                  <div
                    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl group-hover:bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700"
                    style={{
                      animation: `fadeIn ${0.3 + index * 0.1}s ease-in-out both`,
                    }}
                  >
                    <style>
                      {`
                        @keyframes fadeIn {
                          0% { opacity: 0; transform: translateY(20px); }
                          100% { opacity: 1; transform: translateY(0); }
                        }
                      `}
                    </style>
                    <img
                      src={user.ProfilePicture || "/path-to-default-image.jpg"}
                      alt={`${user.Username}'s Profile`}
                      className={`w-full ${
                        isMobile ? "h-40" : "h-60"
                      } object-cover group-hover:opacity-90 transition-opacity duration-300`}
                    />
                    <div className="p-4 text-center backdrop-blur-sm bg-black bg-opacity-50">
                      <h2 className="text-lg font-bold text-white truncate">
                        {user.Username}
                      </h2>
                      <p className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                        View Profile
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllUsers;
