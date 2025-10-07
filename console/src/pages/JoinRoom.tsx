import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";



interface JoinRoomProps {
  roomId: string;
}
const JoinRoom: React.FC<JoinRoomProps> = ({ roomId }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !roomId.trim()) return;
    console.log("joining");
     navigate(`/chat?roomId=${roomId}&userName=${userName}`)
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc] overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-2xl">
            <Users className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-2">Join an Existing Room</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Connect with your friends, classmates, or team members in seconds.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleJoin}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your display name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium flex justify-center items-center transition"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Join Room
          </motion.button>
        </motion.form>

        {/* Highlights */}
        <motion.div
          className="flex justify-center gap-8 mt-10 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div>💬 Seamless</div>
          <div>⚡ Fast</div>
          <div>💜 Secure</div>
        </motion.div>
      </main>
      <Footer/>
    </div>
  );
};

export default JoinRoom;
