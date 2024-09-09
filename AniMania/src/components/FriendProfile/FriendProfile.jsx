import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function FriendProfile({ username, onLogout }) {
  const { profileUsername } = useParams();
  const [FriendData, setFriendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aniDetails, setAniDetails] = useState([]);
  const [mangDetails, setMangDetails] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [FriendId, setFriendId] = useState(null);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:4001/User/data/user-data/${profileUsername}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setFriendData(data);

      // Check if the current user is already a friend
      const isCurrentUserFriend = data.UserFriend.some(
        (friend) => friend.FriendName === username
      );
      setIsFriend(isCurrentUserFriend);

      const animePromises = data.AnimeList.map(({ title }) =>
        fetch(`http://localhost:4001/anime/${title}`).then((res) => res.json())
      );
      const mangaPromises = data.MangaList.map(({ title }) =>
        fetch(`http://localhost:4001/manga/${title}`).then((res) => res.json())
      );

      const [animeData, mangaData] = await Promise.all([Promise.all(animePromises), Promise.all(mangaPromises)]);
      setAniDetails(animeData);
      setMangDetails(mangaData);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch friend photo and ID
  const fetchPhotoData = async () => {
    try {
      const response = await fetch(`http://localhost:4001/User/Userdata/${profileUsername}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user photo data');
      }
      const data = await response.json();
      setFriendId(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch data on profile change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUserData();
        await fetchPhotoData();
      } finally {
        setLoading(false);
      }
    };

    if (profileUsername) {
      fetchData();
    }
  }, [profileUsername]);

  // Handle adding/removing friends
  const handleFriendAction = async () => {
    try {
      const action = isFriend ? 'removeFriend' : 'addFriend';
      const response = await fetch(`http://localhost:4001/User/data/${action}/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendUsername: profileUsername }),
      });
  
      if (response.ok) {
        setIsFriend(!isFriend); // Toggle friend status
        fetchUserData(); // Re-fetch data after friend action to update status
      } else {
        setError('Failed to update friendship status');
      }
    } catch (error) {
      setError('Error updating friendship status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };
  if (!FriendData) {
    return <div>No user data available</div>;
  }

  const totalEpisodes = aniDetails.reduce((total, anime) => total + anime.episodes, 0);
  const totalChapters = mangDetails.reduce((total, manga) => total + manga.Chapters, 0);

  const totalAnimeScore = FriendData.AnimeList.reduce((total, { score }) => total + score, 0);
  const meanAnimeScore = FriendData.AnimeList.length ? totalAnimeScore / FriendData.AnimeList.length : 0;

  const totalMangaScore = FriendData.MangaList.reduce((total, { score }) => total + score, 0);
  const meanMangaScore = FriendData.MangaList.length ? totalMangaScore / FriendData.MangaList.length : 0;

  return (
    <>
      <Navbar username={username} onLogout={onLogout} />

      <div className="relative min-h-screen flex flex-col overflow-y-auto p-8">
        {/* Black Background with Blur */}
        <div className="absolute inset-0 bg-black backdrop-blur-md"></div>

        <div className="relative flex-grow grid grid-cols-10 gap-8 max-w-screen-lg mx-auto">
          {/* Left Column (Profile + Info) */}
          <div className="col-span-3 flex flex-col gap-8">
            {/* User Profile Section */}
            <div className="col-span-3 flex flex-col gap-4 items-center">
  {/* User Profile Section */}
  <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-md w-full">
    <div className="w-full h-80 bg-gray-700 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
      {/* Profile Picture Area */}
      <img
        src={FriendId?.ProfilePicture || '/path/to/default/profile/picture'}
        alt="User Profile"
        className="w-full h-full object-cover"
      />
    </div>

    {/* User Details Section */}
    <div className="bg-white  text-black p-2 rounded-md mb-4 shadow-lg backdrop-blur-md">
      <p className=" text-md"><strong>Username:</strong> {profileUsername}</p>
      <p className=" text-md"><strong>Age:</strong> {FriendId?.Age || 'N/A'}</p>
      <p className=" text-md"><strong>Joined Date:</strong> {formatDate(FriendData.DateJoined)}</p>
      <p className=" text-md"><strong>Gender:</strong> {FriendId?.Gender || 'N/A'}</p>
    </div>

    {/* Button to Change Profile Picture */}
    <button
                  onClick={handleFriendAction}
                  className={`py-2 px-4 rounded-md ${isFriend ? 'bg-red-500' : 'bg-green-500'} text-white`}
                >
                  {isFriend ? 'Remove Friend' : 'Add Friend'}
                </button>

  </div>
</div>


            {/* Anime & Manga Info Section */}
            <div className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-80 p-6 rounded-lg shadow-2xl">
              <h2 className="text-3xl font-extrabold mb-6 text-white text-center tracking-wide uppercase">Statistics</h2>

              {/* Anime Section */}
              <div className="mb-8">
                <div className="border-white border-[1.5px] p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
                  <h4 className="text-xl font-bold mb-4 text-yellow-400 text-center">Anime Stats</h4>
                  <p className="text-base text-gray-300 mb-2"><strong>Anime Watched:</strong> {FriendData.AnimeList.length}</p>
                  <p className="text-base text-gray-300 mb-2"><strong>Mean Anime Score:</strong> {meanAnimeScore.toFixed(2)}</p>
                  <p className="text-base text-gray-300 mb-2"><strong>Total Episodes:</strong> {totalEpisodes}</p>
                  <div className="mt-4 text-center">
                    <Link to="/userAnimeList" className="bg-white text-gray-900 hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 px-4 py-2 rounded-md text-sm font-semibold transition duration-300">
                      Anime List
                    </Link>
                  </div>
                </div>
              </div>

              {/* Manga Section */}
              <div>
                <div className="border-white border-[1.5px] p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
                  <h4 className="text-xl font-bold mb-4 text-pink-400 text-center">Manga Stats</h4>
                  <p className="text-base text-gray-300 mb-2"><strong>Manga Read:</strong> {FriendData.MangaList.length}</p>
                  <p className="text-base text-gray-300 mb-2"><strong>Mean Manga Score:</strong> {meanMangaScore.toFixed(2)}</p>
                  <p className="text-base text-gray-300 mb-2"><strong>Total Chapters:</strong> {totalChapters}</p>
                  <div className="mt-4 text-center">
                    <Link to="/userMangaList" className="bg-white text-gray-900 hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 px-4 py-2 rounded-md text-sm font-semibold transition duration-300">
                      Manga List
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Hero Image Section) */}
          <div className="col-span-7 bg-gray-800 bg-opacity-70 rounded-lg shadow-md overflow-hidden flex items-center justify-center">
            <img
              src="https://w0.peakpx.com/wallpaper/923/727/HD-wallpaper-anime-digital-art-artwork-2d-portrait-display-kimetsu-no-yaiba-kamado-tanjir%C5%8D-anime-boys-night-sword-moon-nakamura-eight.jpg"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative min-h-screen flex flex-col overflow-y-auto p-8">
          {/* Black Background with Blur */}
          <div className="absolute inset-0 bg-black backdrop-blur-md"></div>

          <div className='relative flex flex-col'>
            {/* Anime Watched Section */}
            {aniDetails.length > 0 && (
  <div className='flex-1 bg-gray-800 bg-opacity-70 h-1/2 p-6 rounded-lg shadow-md mb-4'>
    <h2 className="text-xl font-bold mb-4 px-7 text-white">Anime Watched</h2>
    <div className="grid grid-cols-6 gap-4 px-2">
      {aniDetails.slice(0, 6).map(anime => (
        <Link to={`/AniDetails/${anime.Name}`} key={anime._id} className="flex justify-center px-1">
  <img
    src={anime.Photo}
    alt={anime.Name}
    className="w-30 h-60 object-cover rounded-md transition-transform duration-300 transform hover:scale-110"
  />
</Link>

      ))}
    </div>
  </div>
)}

            {/* Manga Read Section */}
            {mangDetails.length > 0 && (
              <div className='flex-1 bg-gray-800 bg-opacity-70 h-1/2 p-6 rounded-lg shadow-md'>
                <h2 className="text-xl font-bold mb-4 px-7 text-white">Manga Read</h2>
                <div className="grid grid-cols-6 gap-4 px-2">
                  {mangDetails.slice(0, 6).map(manga => (
                    <Link to={`/MangDetails/${manga.Name}`} key={manga._id} className="flex justify-center px-1">
                      <img
                        src={manga.Photo}
                        alt={manga.Name}
                        className="w-30 h-60 object-cover rounded-md transition-transform duration-300 transform hover:scale-110"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FriendProfile;
