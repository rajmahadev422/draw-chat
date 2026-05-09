import { useEffect, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import useRoom from "../store/useRoom";
import useAuth from "../store/useAuth";
import { connectWS, openFullscreen } from "../utils/socket";
import toast from "react-hot-toast";

export default function WaitingRoom() {
  const { roomId } = useParams();

  const { roomFlow, initialize, handleMsg } = useRoom();
  const { user } = useAuth();
  const [players, setPlayers] = useState();

  const screenRef = useRef();

  useEffect(() => {
    const io = connectWS();

    io.on("connect", () => {

      initialize(io);

      io.emit("join-room", { roomId, user });

      io.on("active-users", (activeRooms) => {
        const arr = Object.values(activeRooms);

        setPlayers(arr);
      });
    });

    io.on("error-message", (error) => toast.error(error));
    io.on("receive-msg", handleMsg);
    io.on("join-notice", (username) => {
      toast.success(`${username} joined the group!`);
    });

    return () => {
      io.emit("removed", user._id);
    };
  }, [roomId]);
  return (
    <div ref={screenRef} className="flex fixed top-0 left-0 right-0 h-screen z-200">

  {/* Sidebar */}
  <div className="w-50 h-screen overflow-y-auto relative border-r border-white/10 bg-[#111827] p-5 shrink-0">

    <div className="flex items-center sticky top-0 justify-between mb-6">
      <h2 className="text-2xl font-bold tracking-wide">
        Players
      </h2>

      <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
        {players?.length || 0}
      </span>
    </div>

    <div className="space-y-3">
      {players?.map((pl) => (
        <div
          key={pl.socketId}
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 rounded-2xl p-4"
        >

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg uppercase">
            {pl.name?.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="font-medium">
              {pl.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 px-1 h-screen overflow-y-auto bg-slate-950">
    <button className="fixed top-10 right-10" onClick={() => openFullscreen(screenRef)}>F</button>
    <Outlet />
  </div>
</div>
  );
}
