import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faList, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ username, onLogout }) {
  const [isFirstDropdownOpen, setFirstDropdownOpen] = useState(false);
  const [isThirdDropdownOpen, setThirdDropdownOpen] = useState(false);
  const [isUsernameDropdownOpen, setUsernameDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!username) {
      console.error('Username is not provided');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:4001/User/Userdata/${username}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setProfilePicture(userData.ProfilePicture);
        } else {
          console.error('Failed to fetch user data');
          setError('Failed to fetch user data');
        }

        // Fetch notifications
        const notificationsResponse = await fetch(`http://localhost:4001/User/data/user-data/${username}`);
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.Notifications || []); // Update notifications state
          setUnreadCount(notificationsData.Notifications ? notificationsData.Notifications.filter(n => !n.read).length : 0);
        } else {
          console.error('Failed to fetch notifications');
          setError('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Optional: Clean up function
    return () => {
      setProfilePicture(null);
      setError(null);
      setLoading(false);
    };
  }, [username]);

  const toggleFirstDropdown = () => {
    setFirstDropdownOpen(!isFirstDropdownOpen);
    setThirdDropdownOpen(false);
    setUsernameDropdownOpen(false);
  };

  const toggleThirdDropdown = () => {
    setThirdDropdownOpen(!isThirdDropdownOpen);
    setFirstDropdownOpen(false);
    setUsernameDropdownOpen(false);
  };

  const toggleUsernameDropdown = () => {
    setUsernameDropdownOpen(!isUsernameDropdownOpen);
    setFirstDropdownOpen(false);
    setThirdDropdownOpen(false);
  };

  const isBlurredBackground = (location.pathname === "/userAnimeList" || location.pathname === "/userMangaList");
  const navbarClass = `relative z-30 ${isBlurredBackground ? 'bg-black bg-opacity-50 backdrop-blur-md mt-4 mx-2 md:mx-20 rounded-md' : 'bg-black'}`;

  return (
    <nav className={navbarClass}>
      <div className="h-[4rem] container mx-auto flex flex-wrap items-center justify-between relative z-30">
        {/* Logo */}
        <Link to="/home">
          <div
            className="w-[15.84rem] h-[3rem] bg-cover bg-center mr-2 sm:mr-8 cursor-pointer"
            style={{
              backgroundImage: "url('https://i.postimg.cc/YSY5xP9n/Logo.png')",
            }}
          ></div>
        </Link>

        {/* Additional Image */}
        <div
          className="w-[15rem] h-[2.5rem] bg-cover bg-center mr-2 sm:mr-[10rem] hidden 1040px:block"
          style={{
            backgroundImage:
              "url('https://i.postimg.cc/7hkYV7w7/Screenshot-2024-08-18-033805.png')",
          }}
        ></div>

        {/* Nav Items */}
        <div className="flex flex-grow justify-end space-x-4 relative z-20">
          {/* First Dropdown */}
          <div className="relative z-30">
            <a
              href="#"
              onClick={toggleFirstDropdown}
              className="sm:h-[3rem] flex items-center justify-center text-white"
            >
              <FontAwesomeIcon
                icon={faList}
                style={{ fontSize: '36px' }}
              />
            </a>
            {isFirstDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-40">
                <Link
                  to="/userAnimeList"
                  className="block bg-gray-700 px-4 py-2 text-white hover:bg-white hover:text-black"
                >
                  Anime List
                </Link>
                <Link
                  to="/userMangaList"
                  className="block bg-gray-700 px-4 py-2 text-white hover:bg-white hover:text-black"
                >
                  Manga List
                </Link>
                <Link
                  to="/favourite"
                  className="block bg-gray-700 px-4 py-2 text-white hover:bg-white hover:text-black"
                >
                  Favourite
                </Link>
                <Link
                  to="/interested-genre"
                  className="block bg-gray-700 px-4 py-2 text-white hover:bg-white hover:text-black"
                >
                  Interested Genre
                </Link>
              </div>
            )}
          </div>

          {/* Second Icon */}
          <div className="relative z-30 sm:h-[3rem] flex items-center justify-center">
            <Link to="/MyFriends" className="h-[3rem] flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '36px' }} />
            </Link>
          </div>

          {/* Third Dropdown */}
          <div className="relative z-30">
          <a
              href="#"
              onClick={toggleThirdDropdown}
              className="relative sm:h-[3rem] flex items-center justify-center text-white"
            >
              <FontAwesomeIcon icon={faBell} style={{ fontSize: '36px' }} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-red-100 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </a>

            {isThirdDropdownOpen && (
  <div className="absolute right-0 mt-2 w-72 bg-gray-900 text-white shadow-xl rounded-lg z-40 border border-gray-700">
    <div className="px-4 py-2 border-b border-gray-700 font-semibold text-lg">
      Notifications
    </div>
    {notifications.length > 0 ? (
      notifications.map((notification, index) => (
        <div
          key={index}
          className="px-4 py-3 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200"
        >
          {notification.message}
        </div>
      ))
    ) : (
      <div className="px-4 py-3 text-gray-400">
        No notifications
      </div>
    )}
  </div>
)}
          </div>

          {/* Username and Profile Picture Dropdown */}
          <div className="relative z-30">
            <a
              href="#"
              onClick={toggleUsernameDropdown}
              className="h-[3rem] flex items-center justify-center text-white"
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <span>{username}</span>
              )}
              <FontAwesomeIcon icon={isUsernameDropdownOpen ? faCaretUp : faCaretDown} />
            </a>
            {isUsernameDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-40">
                <Link
                  to="/profile"
                  className="block bg-gray-700 px-4 py-2 text-white hover:bg-white hover:text-black"
                >
                  Profile
                </Link>
                <Link
                  to="/MyReviews"
                  className="block bg-gray-700 px-4 py-2 text-white hover:bg-white hover:text-black"
                >
                  My Reviews
                </Link>
                <button
                  onClick={onLogout}
                  className="block bg-gray-700 px-4 py-2 text-white hover:bg-white hover:text-black w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
