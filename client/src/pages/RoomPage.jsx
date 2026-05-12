import React, { useState } from "react";
import CreateRoom from "../components/room/CreateRoom";
import JoinRoom from "../components/room/JoinRoom";

export default function RoomPage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="relative min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-600 opacity-15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-pink-600 opacity-15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600 opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.13] rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="text-center px-6 pt-8 pb-5">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M12 12h.01M8 12h.01M16 12h.01" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-white mb-1">Game rooms</h1>
            <p className="text-sm text-white/45">
              Create or join a room to start playing
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.09]">
            {[
              { key: "create", label: "Create room", icon: "+" },
              { key: "join", label: "Join room", icon: "→" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-medium relative transition-colors ${
                  activeTab === key
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <span className="text-base leading-none">{icon}</span>
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-[10%] right-[10%] h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                )}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="p-5">
            {activeTab === "create" ? <CreateRoom /> : <JoinRoom />}
          </div>
        </div>

        <p className="text-center text-white/20 text-[11px] mt-5">
          All room data is for demo purposes only
        </p>
      </div>
    </div>
  );
}
