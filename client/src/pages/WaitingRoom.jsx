import { useEffect, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import useRoom from "../store/useRoom";
import useAuth from "../store/useAuth";
import { connectWS, openFullscreen } from "../utils/socket";
import toast from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";

const AVATAR_COLORS = [
  "bg-purple-900 text-purple-200",
  "bg-teal-900 text-teal-200",
  "bg-orange-900 text-orange-200",
  "bg-pink-900 text-pink-200",
  "bg-blue-900 text-blue-200",
];

export default function WaitingRoom() {
  const { roomId } = useParams();
  const { initialize, handleMsg } = useRoom();
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const screenRef = useRef();

  useEffect(() => {
    const io = connectWS();

    io.on("connect", () => {
      initialize(io);
      io.emit("join-room", { roomId, user });
      io.on("active-users", (activeRooms) => {
        setPlayers(Object.values(activeRooms));
      });
    });

    io.on("error-message", (error) => toast.error(error));
    io.on("receive-msg", handleMsg);
    io.on("join-notice", (username) =>
      toast.success(`${username} joined the room!`),
    );

    return () => {
      io.emit("removed", user._id);
    };
  }, [roomId]);

  return (
    <div
      ref={screenRef}
      className="flex fixed inset-0 z-50 bg-slate-950 text-white"
    >
      {/* Sidebar */}
      <aside className="w-48 sm:w-52 shrink-0 flex flex-col bg-slate-900 border-r border-white/6 overflow-hidden">
        {/* Sidebar header */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-linear-to-b from-[#16161d] to-[#101014] shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {/* Players Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center">
                <span className="text-sm">👥</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/35 font-semibold">
                  Players
                </span>

                <span className="text-sm font-medium text-white/85">
                  Active Participants
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/20 shadow-inner shadow-purple-500/10">
              <span className="text-xs font-semibold text-purple-200">
                {players.length}
              </span>
            </div>
          </div>

          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 h-14 bg-white/2 border-b border-white/8">
            <div className="flex items-center gap-2">
              <button
                className="group relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/4 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
                title="Copy invite link"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
              >
                <IoCopyOutline className="text-[18px]" />

                <div className="absolute -bottom-9 scale-0 group-hover:scale-100 transition-transform px-2 py-1 rounded-md bg-black text-[10px] text-white whitespace-nowrap">
                  Copy Link
                </div>
              </button>

              <button
                className="group relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/4 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
                title="Fullscreen"
                onClick={() => openFullscreen(screenRef)}
              >
                <MdFullscreen className="text-[20px]" />

                <div className="absolute -bottom-9 scale-0 group-hover:scale-100 transition-transform px-2 py-1 rounded-md bg-black text-[10px] text-white whitespace-nowrap">
                  Fullscreen
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-[11px] tracking-wide text-white/40 uppercase">
                Room
              </span>

              <span className="text-sm font-semibold text-white/80">
                #{roomId}
              </span>
            </div>
          </div>
        </div>

        {/* Player list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {players.map((pl, i) => (
            <div
              key={pl.socketId}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 bg-white/3 hover:bg-white/[0.07] border border-white/6 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-medium uppercase ${
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                }`}
              >
                {pl.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/85 truncate">
                  {pl.name}
                </p>
                <p className="text-[11px] text-white/30">
                  {i === 0 ? "Host" : "Player"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Outlet */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
