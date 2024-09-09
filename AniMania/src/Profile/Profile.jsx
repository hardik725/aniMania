import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

function Profile({ username, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animeDetails, setAnimeDetails] = useState([]);
  const [mangaDetails, setMangaDetails] = useState([]);
  const [UserId, setUser] = useState();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    ProfilePicture: '',
    Gender: '',
    Age: ''
  });

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        const response = await fetch(`http://localhost:4001/User/Userdata/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user photo data');
          setError('Failed to fetch user photo data');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching user photo data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPhotoData();
    }
  }, [username]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4001/User/data/user-data/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          const animePromises = data.AnimeList.map(({ title }) =>
            fetch(`http://localhost:4001/anime/${title}`).then((res) => {
              if (res.ok) return res.json();
              throw new Error(`Failed to fetch anime: ${title}`);
            })
          );
          const animeData = await Promise.all(animePromises);
          setAnimeDetails(animeData);

          const mangaPromises = data.MangaList.map(({ title }) =>
            fetch(`http://localhost:4001/manga/${title}`).then((res) => {
              if (res.ok) return res.json();
              throw new Error(`Failed to fetch manga: ${title}`);
            })
          );
          const mangaData = await Promise.all(mangaPromises);
          setMangaDetails(mangaData);
        } else {
          console.error('Failed to fetch user data');
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleEditClick = () => {
    setEditMode(true);
    setUpdatedUser({
      ProfilePicture: UserId.ProfilePicture,
      Gender: UserId.Gender,
      Age: UserId.Age
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Handle file upload logic here (e.g., upload to server and get the URL)
    // Assuming we receive the URL after upload, we update the state
    const fileUrl = URL.createObjectURL(file); // Temporary URL, replace with the actual server URL
    setUpdatedUser((prev) => ({ ...prev, ProfilePicture: fileUrl }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement logic to update the user details on the server
      const response = await fetch(`http://localhost:4001/User/update/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData);
        setEditMode(false);
      } else {
        console.error('Failed to update user data');
        setError('Failed to update user data');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error updating user data');
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  if (!userData) {
    return <div>No user data available</div>;
  }

  const totalEpisodes = animeDetails.reduce((total, anime) => total + anime.episodes, 0);
  const totalChapters = mangaDetails.reduce((total, manga) => total + manga.Chapters, 0);

  const totalAnimeScore = userData.AnimeList.reduce((total, { score }) => total + score, 0);
  const meanAnimeScore = userData.AnimeList.length ? totalAnimeScore / userData.AnimeList.length : 0;

  const totalMangaScore = userData.MangaList.reduce((total, { score }) => total + score, 0);
  const meanMangaScore = userData.MangaList.length ? totalMangaScore / userData.MangaList.length : 0;

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
                    src={UserId.ProfilePicture}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Details Section */}
                <div className="bg-white text-black p-2 rounded-md mb-4 shadow-lg backdrop-blur-md">
                  <p className="text-md"><strong>Username:</strong> {username}</p>
                  <p className="text-md"><strong>Age:</strong> {UserId.Age}</p>
                  <p className="text-md"><strong>Joined Date:</strong> {formatDate(userData.DateJoined)}</p>
                  <p className="text-md"><strong>Gender:</strong> {UserId.Gender}</p>
                </div>

                {/* Button to Change Profile Picture */}
                <button
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-md backdrop-blur-md"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </button>

                {/* Edit Profile Form */}
                {editMode && (
                  <form onSubmit={handleFormSubmit} className="mt-4 bg-gray-800 p-4 rounded-md">
                    <div className="mb-4">
                      <label className="text-white">Profile Picture</label>
                      <input type="file" onChange={handleFileChange} className="text-white" />
                    </div>
                    <div className="mb-4">
                      <label className="text-white">Gender</label>
                      <select
                        name="Gender"
                        value={updatedUser.Gender}
                        onChange={handleInputChange}
                        className="block w-full mt-1 bg-gray-700 text-white p-2 rounded"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="text-white">Age</label>
                      <input
                        type="number"
                        name="Age"
                        value={updatedUser.Age}
                        onChange={handleInputChange}
                        className="block w-full mt-1 bg-gray-700 text-white p-2 rounded"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-md"
                    >
                      Save Changes
                    </button>
                  </form>
                )}
              </div>
            </div>


            {/* Anime & Manga Info Section */}
            <div className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-80 p-6 rounded-lg shadow-2xl">
              <h2 className="text-3xl font-extrabold mb-6 text-white text-center tracking-wide uppercase">Statistics</h2>

              {/* Anime Section */}
              <div className="mb-8">
                <div className="border-white border-[1.5px] p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
                  <h4 className="text-xl font-bold mb-4 text-yellow-400 text-center">Anime Stats</h4>
                  <p className="text-base text-gray-300 mb-2"><strong>Anime Watched:</strong> {userData.AnimeList.length}</p>
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
                  <p className="text-base text-gray-300 mb-2"><strong>Manga Read:</strong> {userData.MangaList.length}</p>
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
            {animeDetails.length > 0 && (
  <div className='flex-1 bg-gray-800 bg-opacity-70 h-1/2 p-6 rounded-lg shadow-md mb-4'>
    <h2 className="text-xl font-bold mb-4 px-7 text-white">Anime Watched</h2>
    <div className="grid grid-cols-6 gap-4 px-2">
      {animeDetails.slice(0, 6).map(anime => (
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
            {mangaDetails.length > 0 && (
              <div className='flex-1 bg-gray-800 bg-opacity-70 h-1/2 p-6 rounded-lg shadow-md'>
                <h2 className="text-xl font-bold mb-4 px-7 text-white">Manga Read</h2>
                <div className="grid grid-cols-6 gap-4 px-2">
                  {mangaDetails.slice(0, 6).map(manga => (
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

export default Profile;
