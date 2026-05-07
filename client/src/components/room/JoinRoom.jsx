import React from "react";
import { FaArrowRight, FaDoorOpen } from "react-icons/fa";
import useRoom from "../../store/useRoom";
import ButtonLoader from "../loaders/ButtonLoader";

const JoinRoom = () => {
  const { handleJoinRoom, loading } = useRoom();
  return (
    <div>
      <form onSubmit={handleJoinRoom} className="p-6 space-y-6">
        {/* Room Code Input */}
        <div>
          <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
            <FaDoorOpen className="text-indigo-300" />
            Room Code
          </label>
          <input
            type="text"
            name="roomId"
            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400`}
            placeholder="Enter room code..."
            autoComplete="off"
          />
        </div>

        {/* Join Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <ButtonLoader />
          ) : (
            <>
              <FaArrowRight />
              Join Room
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-white/50 text-xs text-center">
            Enter the 6 character room code provided by the room host
          </p>
        </div>
      </form>
    </div>
  );
};

export default JoinRoom;
