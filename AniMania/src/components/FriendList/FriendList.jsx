import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMessage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ChatBox from '../ChatBox/ChatBox';
import Loading from '../Loading/Loading';

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

  useEffect(() => {
    if (selectedFriend) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedFriend]);

  const blurStyle = {
    filter: 'blur(5px)',
    pointerEvents: 'none',
  };

  if (loading) {
    return <div><Loading message="Loading User Friend List"/></div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;
  }

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />
      <div
        className="min-h-screen bg-fixed bg-cover bg-center p-2 sm:p-4 relative"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/beautiful-anime-character-cartoon-scene_23-2151035176.jpg?ga=GA1.1.1729476715.1720013001&semt=ais_hybrid')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {/* Wrapper for content to blur */}
        <div
          className="content-wrapper"
          style={selectedFriend ? blurStyle : {}}
        >
          <div
            className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-lg shadow-lg mx-auto max-w-full sm:max-w-3xl relative"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-900">
              Friends of {username}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg">
                <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
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
                      <td className="py-2 px-4 text-gray-800">{friend.FriendName}</td>
                      <td className="py-2 px-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-all"
                          onClick={() => setSelectedFriend(friend.FriendName)}
                        >
                          <FontAwesomeIcon icon={faMessage} /> Message
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        <Link to={`/friendprofile/${friend.FriendName}`}>
                          <button className="text-green-600 hover:text-green-800 transition-all">
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
        </div>

        {/* Chat box (not blurred) */}
        {selectedFriend && (
          <div className="fixed inset-0 flex justify-center items-center z-30">
            <div className="rounded-lg shadow-xl w-11/12 sm:w-3/5 overflow-y-auto max-h-[80vh] transform scale-95 transition-transform duration-300 ease-out">
              <ChatBox
                username={username}
                friend={selectedFriend}
                onClose={() => setSelectedFriend(null)}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FriendsList;
