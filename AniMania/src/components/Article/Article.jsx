import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const Article = ({ username, onLogout }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-blue-900 text-white">
        <p className="text-2xl">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-gray-100">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:from-pink-500 hover:to-purple-500 transition duration-300"
        >
          ← Back
        </button>
      </div>

      {/* Article Container */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-md">
          {article.Title}
        </h1>

        {/* Image */}
        <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
          <img
            src={article.Url}
            alt={article.Title}
            className="w-full h-[400px] sm:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <p className="text-white text-lg italic">Exclusive Feature</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-900 bg-opacity-90 p-8 mt-8 rounded-xl shadow-2xl text-white space-y-6">
          <p className="text-lg leading-relaxed text-gray-300">
            {article.Content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Article;
