import React, { useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaDoorOpen,
  FaHashtag,
  FaUserFriends,
  FaArrowRight,
  FaGamepad,
} from "react-icons/fa";
import { MdSportsEsports, MdCreate, MdLogin } from "react-icons/md";
import CreateRoom from "../components/room/CreateRoom";
import JoinRoom from "../components/room/JoinRoom";

export default function RoomPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("create");

  // Error state for validation
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="text-center pt-8 pb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4">
              <FaGamepad className="text-4xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Game Rooms</h1>
            <p className="text-white/70 text-sm">
              Create or join a room to start playing
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/20">
            <button
              onClick={() => {
                setActiveTab("create");
                setErrors({});
                setSuccessMessage("");
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative flex items-center justify-center gap-2 ${
                activeTab === "create"
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <MdCreate className="text-lg" />
              Create Room
              {activeTab === "create" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-400 to-purple-400 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("join");
                setErrors({});
                setSuccessMessage("");
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative flex items-center justify-center gap-2 ${
                activeTab === "join"
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <MdLogin className="text-lg" />
              Join Room
              {activeTab === "join" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-400 to-purple-400 rounded-full"></div>
              )}
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
              <p className="text-emerald-100 text-sm text-center">
                {successMessage}
              </p>
            </div>
          )}

          {/* Create Room Form */}
          {activeTab === "create" && <CreateRoom />}

          {/* Join Room Form */}
          {activeTab === "join" && <JoinRoom />}
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-6">
          All room data is logged to console for demo purposes
        </p>
      </div>
    </div>
  );
}
