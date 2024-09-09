import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMessage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ChatBox from '../ChatBox/ChatBox'; // Import the ChatBox component

const FriendsList = ({ username, onLogout }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4001/User/data/user-data/${username}`);
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
        className="min-h-screen bg-fixed bg-cover bg-center p-4"
        style={{ backgroundImage: `url('https://images5.alphacoders.com/947/thumb-1920-947670.jpg')` }}
      >
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Friends of {username}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold">#</th>
                  <th className="py-3 px-6 text-left font-semibold">Friend Name</th>
                  <th className="py-3 px-6 text-left font-semibold">Message</th>
                  <th className="py-3 px-6 text-left font-semibold">View Profile</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((friend, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="py-2 px-6">{index + 1}</td>
                    <td className="py-2 px-6">{friend.FriendName}</td>
                    <td className="py-2 px-6">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setSelectedFriend(friend.FriendName)}
                      >
                        <FontAwesomeIcon icon={faMessage} /> Message
                      </button>
                    </td>
                    <td className="py-2 px-6">
                      <Link to={`/friendprofile/${friend.FriendName}`}>
                        <button className="text-green-500 hover:text-green-700">
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
          <ChatBox 
            username={username} 
            friend={selectedFriend} 
            onClose={() => setSelectedFriend(null)} 
          />
        )}
      </div>
    </>
  );
};

export default FriendsList;
