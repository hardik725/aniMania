import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://animania-backend-dmjs.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User Logged In:', data);

        // Trigger SweetAlert success alert
        Swal.fire({
          title: 'Login Successful!',
          text: `Welcome back, ${username}!`,
          icon: 'success', // SweetAlert2 inbuilt success icon
          showConfirmButton: false, // No confirm button
          timer: 1500, // Wait for 1.5 seconds before redirecting
          timerProgressBar: true, // Show progress bar
        }).then(() => {
          onLogin(username); // Pass the username to the parent component
          navigate('/home'); // Redirect to home page
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error!',
          text: errorData.message || 'An error occurred during login.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred during login.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/Y2b7D1jx/wp5203548-all-the-animes-wallpapers.jpg')",
      }}
    >
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 z-0"
        style={{ backdropFilter: 'blur(5px)' }} // Reduced blur intensity
      ></div>

      {/* Login Box */}
      <div className="relative z-10 w-11/12 max-w-sm p-6 shadow-2xl rounded-xl bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 text-white sm:w-full sm:max-w-md sm:p-8 md:max-w-md lg:max-w-lg animate-float"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="username"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-transparent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-transparent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-700 text-white font-bold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleSignUpRedirect}
          className="w-full mt-4 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
