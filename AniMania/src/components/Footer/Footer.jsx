import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 py-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AniMania. Designed and Developed by Hardik. All rights reserved.
          </p>
        </div>
      </footer>
    );
};

export default Footer;