import React from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const Header: React.FC = () => {
  return (
    <motion.header
      className="flex items-center justify-between px-8 py-4 bg-white shadow-sm"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4a9 9 0 1 0-18 0h18z"
            />
          </svg>
        </div>
        <Link to="/">
          <h1 className="text-lg font-semibold cursor-pointer">Free Chat</h1>
        </Link>
      </div>
      <p className="text-sm text-gray-500">Connect instantly, chat freely</p>
    </motion.header>
  );
};

export default Header;
