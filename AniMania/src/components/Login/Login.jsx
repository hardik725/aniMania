import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          Password: password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User Logged In:', data);
        toast.success('Login successful!', { position: 'top-center'}); // Success toast
        onLogin(username);  // Pass the username to the parent component
        navigate('/home');
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`, { position: 'top-center' }); // Error toast
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during login.', { position: 'top-center' }); // Error toast
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://i.postimg.cc/Y2b7D1jx/wp5203548-all-the-animes-wallpapers.jpg')"
      }}
    >
      <div className="w-full max-w-md p-8 shadow-md rounded-lg backdrop-blur-xl opacity-90">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="username">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleSignUpRedirect}
          className="w-full mt-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
