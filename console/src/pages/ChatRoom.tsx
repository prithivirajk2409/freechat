import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, Share2Icon, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JoinRoom from "./JoinRoom";
import Header from "./Header";
import Footer from "./Footer";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [roomName, setRoomName] = useState("");
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userName = query.get("userName");
  const roomId = query.get("roomId");
  const BACKEND_URL = import.meta.env.MODE === "development"
        ? "http://localhost:8080"
        : "https://freechat-xfo8.onrender.com"

  const FRONTEND_URL = import.meta.env.MODE === "development"
        ? "http://localhost:5173"
        : "http://localhost:4173"
  const shareLink = `${FRONTEND_URL}/chat?roomId=${roomId}`;

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: userName ?? '',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(newMsg));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const initialize = async () => {
    const res = await fetch(`${BACKEND_URL}/app/chat/room/${roomId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    const parsedMessages: Message[] = data.roomDetails.history
      .map((str: any) => {
        try {
          return JSON.parse(str);
        } catch {
          return null;
        }
      })
      .filter(
        (msg: any): msg is Message =>
          msg !== null &&
          typeof msg === 'object' &&
          typeof msg.id === 'number' &&
          typeof msg.sender === 'string' &&
          typeof msg.text === 'string' &&
          typeof msg.time === 'string'
      );

    setMessages(parsedMessages);
    setRoomName(data.roomDetails.roomName);
    setUsers(data.roomDetails.members || []);
  };

  useEffect(() => {
    // if (!roomId || !userName) {
    //   navigate("/");
    //   return;
    // }

    initialize();
  }, [roomId, userName]);

  useEffect(() => {
    if (!roomId || !userName) return;

    const ws = new WebSocket(
      `${BACKEND_URL}/app/joinRoom?roomId=${roomId}&userName=${userName}`
    );

    socketRef.current = ws;

    ws.onopen = () => console.log("Connected to room");
    ws.onclose = () => console.log("Disconnected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        console.warn("Invalid message received:", event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId, userName]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  if (!userName) {
    console.log(userName);
    console.log(roomId);
    return <JoinRoom roomId={roomId ?? ''} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f7f9fc] to-white">
      {/* Global Header */}
      <Header />

      <div className="flex flex-1 min-h-[calc(100vh-120px)] overflow-hidden">
        {/* Left: Fixed User List */}
        <div className="w-200 bg-white border-r shadow-inner flex-shrink-0 flex flex-col">
          <motion.div
            className="px-6 py-6 border-b bg-gray-50"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-sm font-semibold text-gray-600">
              People in this room
            </h2>
          </motion.div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-2">
              {users.map((user, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-xs text-white font-bold">
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span>{user}</span>
                </li>
              ))}
            </ul>
          </div>
          <Footer />
        </div>

        {/* Right: Chat Area */}
        <div className="flex-1 flex flex-col ">
          {/* Fixed Room Header */}
          <motion.header
            className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md flex-shrink-0"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-semibold text-lg">{roomName}</h1>
            </div>
            <div className="relative flex items-center gap-4">
              <Share2Icon
                className="w-5 h-5 cursor-pointer hover:text-gray-200"
                onClick={handleCopy}
              />
              {copied && (
                <div className="absolute right-0 top-6 text-xs text-white bg-black px-2 py-1 rounded shadow">
                  Link copied!
                </div>
              )}
            </div>
          </motion.header>

          {/* Scrollable Message List */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[#e6f2ea]"
          >

            <div className="flex justify-center">
              <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                Today
              </span>
            </div>

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === userName ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender !== userName ? (
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
                        {msg.sender.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">{msg.sender}</p>
                        <div className="max-w-xs md:max-w-md bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm">
                          <p>{msg.text}</p>
                          <p className="text-[10px] mt-1 text-gray-500">{msg.time}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <div className="max-w-xs md:max-w-md bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl rounded-br-none px-4 py-2 text-sm shadow-md">
                        <p>{msg.text}</p>
                        <p className="text-[10px] mt-1 text-white/70">{msg.time}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Fixed Input Area */}
          <motion.form
            onSubmit={sendMessage}
            className="px-4 py-3 flex items-center gap-2 border-t bg-white/90 backdrop-blur-md shadow-lg flex-shrink-0"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full p-2 shadow-md hover:opacity-90 transition"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </motion.form>
        </div>
      </div>

      {/* Global Footer */}


    </div>

  );
};

export default ChatRoom;
