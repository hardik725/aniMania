import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMessage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ChatBox from '../ChatBox/ChatBox';

const FriendsList = ({ username, onLogout }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://animania-backend-dmjs.onrender.com/user/data/user-data/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setFriends(data.UserFriend);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <div className="text-center mt-8 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">Error: {error}</div>;
  }

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      <div
        className="min-h-screen bg-fixed bg-cover bg-center p-2 sm:p-4 relative"
        style={{ backgroundImage: `url('https://images5.alphacoders.com/947/thumb-1920-947670.jpg')` }}
      >
        {/* Overlay when chatbox is open */}
        {selectedFriend && (
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10 transition-all duration-300"></div>
        )}

        <div className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-lg shadow-lg mx-auto max-w-full sm:max-w-3xl relative z-20">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Friends of {username}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <tr>
                  <th className="py-2 sm:py-3 px-4 text-left font-semibold">#</th>
                  <th className="py-2 sm:py-3 px-4 text-left font-semibold">Friend Name</th>
                  <th className="py-2 sm:py-3 px-4 text-left font-semibold">Message</th>
                  <th className="py-2 sm:py-3 px-4 text-left font-semibold">View Profile</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((friend, index) => (
                  <tr key={index} className="border-t border-gray-300 hover:bg-gray-100 transition-all">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{friend.FriendName}</td>
                    <td className="py-2 px-4">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-all"
                        onClick={() => setSelectedFriend(friend.FriendName)}
                      >
                        <FontAwesomeIcon icon={faMessage} /> Message
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/friendprofile/${friend.FriendName}`}>
                        <button className="text-green-500 hover:text-green-700 transition-all">
                          <FontAwesomeIcon icon={faUser} /> View Profile
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedFriend && (
          <div className="fixed inset-0 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg shadow-xl w-11/12 sm:w-3/5 p-6 transform scale-95 transition-transform duration-300 ease-out">
              <ChatBox
                username={username}
                friend={selectedFriend}
                onClose={() => setSelectedFriend(null)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FriendsList;
