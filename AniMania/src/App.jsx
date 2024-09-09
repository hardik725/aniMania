import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home/Home';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Profile from './Profile/Profile';
import TopAnime from './components/TopAnime/TopAnime';
import TopManga from './components/TopManga/TopManga';
import MyAnimeList from './components/MyAnimeList/MyAnimeList';
import MyMangaList from './components/MyMangaList/MyMangaList';
import AniDetails from './components/AniDetails/AniDetails';
import MyReviews from './components/MyReviews/MyReviews';
import MyMangaReview from './components/MyMangaReview/MyMangaReview';
import MangaDetails from './components/MangDetails/MangDetails';
import FriendList from './components/FriendList/FriendList';
import FriendProfile from './components/FriendProfile/FriendProfile';

function App() {
  const [username, setUsername] = useState(null);

  const handleLogin = (user) => {
    setUsername(user);
  };

  const handleLogout = () => {
    setUsername(null); // Clear the username to log out the user
  };

  return (
    <Routes>
      <Route path="/" element={username ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={username ? <Home username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/profile" element={username ? <Profile username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/topAnime" element={username ? <TopAnime username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/topManga" element={username ? <TopManga username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/userAnimeList" element={username ? <MyAnimeList username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/userMangaList" element={username ? <MyMangaList username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/AniDetails/:animeName" element={username ? <AniDetails username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/MangDetails/:mangaName" element={username ? <MangaDetails username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/MyReviews" element={username ? <MyReviews username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/MyMangaReview" element={username ? <MyMangaReview username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route path="/MyFriends" element={username ? <FriendList username={username} onLogout={handleLogout} /> : <Navigate to="/" />} />
      <Route
        path="/friendprofile/:profileUsername"
        element={
          username ? (
            <FriendProfile
              username={username} // Current logged-in user
              onLogout={handleLogout} // Logout function
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
