import React, { useState } from "react";
import { User, CheckCircle, Copy, LogIn, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";



const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showRoom, setShowRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");

  const FRONTEND_URL = import.meta.env.MODE === "development"
        ? "http://localhost:5173"
        : "http://localhost:4173"
  
  const shareLink = `${FRONTEND_URL}/chat?roomId=${roomId}`;


  const BACKEND_URL = import.meta.env.MODE === "development"
        ? "http://localhost:8080"
        : "https://freechat-xfo8.onrender.com"


  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const refreshPage = () => {
    setUserName("");
    setShowRoom(false);
    setRoomName("");
    setRoomId("");
    navigate("/");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BACKEND_URL}/app/chat/createRoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, roomName }),
      });
      const data = await res.json();
      setRoomId(data.roomDetails.roomId);
      setShowRoom(true);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <>
      {!showRoom ? (
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
                <User className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-2">Create Your Chat Room</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Start a conversation with friends, colleagues, or anyone around the world.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleCreate}
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
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium flex justify-center items-center transition"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Room
              </motion.button>
            </motion.form>

            <motion.div
              className="flex justify-center gap-8 mt-10 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div>🔒 Secure</div>
              <div>⚡ Instant</div>
              <div>💚 Free</div>
            </motion.div>
          </main>
          <Footer />
        </div>
      ) : (
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
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-2">Create Your Chat Room</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Start a conversation with friends, colleagues, or anyone around the world.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-green-600 flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-6 h-6" />
                <span>Room Created Successfully!</span>
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Your chat room is ready. Share the link below to invite others.
              </p>

              <motion.div
                className="flex items-center border rounded-lg overflow-hidden"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm text-gray-600 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="bg-blue-500 text-white px-3 py-2 hover:bg-blue-600 transition"
                >
                  <Copy size={18} />
                </button>
              </motion.div>

              <div className="flex justify-between text-sm text-gray-700 mt-2">
                <div><strong>Room Name:</strong> {roomName}</div>
                <div><strong>Host:</strong> {userName}</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/chat?roomId=${roomId}&userName=${userName}`)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex justify-center items-center mt-4"
              >
                <LogIn className="w-5 h-5 mr-2" /> Join Room
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => refreshPage()}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium flex justify-center items-center mt-2 hover:bg-gray-100"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Create Another Room
              </motion.button>
            </motion.div>

            <motion.div
              className="flex justify-center gap-8 mt-10 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div>🔒 Secure</div>
              <div>⚡ Instant</div>
              <div>💚 Free</div>
            </motion.div>
          </main>
          <Footer />
        </div>
      )}
    </>

  );
};

export default CreateRoom;
