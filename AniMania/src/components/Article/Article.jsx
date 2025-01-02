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
      <div className="p-4 sm:p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg hover:from-pink-500 hover:to-purple-500 transition duration-300 text-sm sm:text-base"
        >
          ← Back
        </button>
      </div>

      {/* Article Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white text-center mb-6 sm:mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-md">
          {article.Title}
        </h1>

        {/* Image */}
        <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
          <img
            src={article.Url}
            alt={article.Title}
            className="w-full h-64 sm:h-[400px] md:h-[500px] object-contain"
          />
        </div>

        {/* Content */}
        <div className="bg-gray-900 bg-opacity-90 p-4 sm:p-8 mt-6 sm:mt-8 rounded-xl shadow-2xl text-white space-y-4 sm:space-y-6">
          <p className="text-sm sm:text-lg leading-relaxed text-gray-300">
            {article.Content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Article;
