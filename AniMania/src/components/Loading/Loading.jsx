import React from 'react';

const Loading = ({message}) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
            {/* Gradient Spinner */}
            <div className="relative w-16 h-16">
                <div
                    className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-b-transparent border-l-blue-500 border-r-purple-500 rounded-full animate-spin"
                ></div>
                <div
                    className="absolute top-2 left-2 w-12 h-12 bg-white rounded-full"
                ></div>
            </div>

            {/* Animated Text */}
            <p className="mt-6 text-2xl font-semibold text-gray-800 animate-pulse">
                Loading<span className="text-blue-500">...</span>
            </p>

            {/* Additional Subtext */}
            <p className="mt-2 text-sm text-gray-600">
                {message || "Please wait while we load the content"}
            </p>
        </div>
    );
};

export default Loading;
