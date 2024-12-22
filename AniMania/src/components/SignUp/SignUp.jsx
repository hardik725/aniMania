import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://animania-backend-dmjs.onrender.com/user/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Email: email,
          Password: password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User Signed Up:', data);
        toast.success('Sign Up successful!', { position: 'top-center' });
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`, { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during sign-up.', { position: 'top-center' });
    }
  };
  const redirectToLogin = () => {
    navigate('/');
  };  

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://i.postimg.cc/Y2b7D1jx/wp5203548-all-the-animes-wallpapers.jpg')"
      }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-60 z-0"
        style={{ backdropFilter: 'blur(5px)' }}
      ></div>
      <div
        className="relative z-10 w-full max-w-md p-8 shadow-lg rounded-lg backdrop-blur-lg bg-gradient-to-b from-purple-500 to-blue-600 text-white animate-float"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
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
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-transparent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-transparent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-semibold mb-2"
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
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-transparent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300 mb-2">Already have an account?</p>
          <button
            onClick={redirectToLogin}
            className="px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 font-semibold rounded-full shadow-md hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
          >
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
