import React from "react";
import { FaHashtag, FaUserFriends, FaUserPlus, FaUsers } from "react-icons/fa";
import useRoom from "../../store/useRoom";

const CreateRoom = () => {
  const { handleCreateRoom, loading } = useRoom();
  return (
    <div>
      <form onSubmit={handleCreateRoom} className="p-6 space-y-6">
        {/* Room Title Input */}
        <div>
          <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
            <FaHashtag className="text-indigo-300" />
            Room Title
          </label>
          <input
            type="text"
            name="roomTitle"
            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400`}
            placeholder="Enter room name..."
            autoComplete="off"
          />
        </div>

        {/* Number of Players Input */}
        <div>
          <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
            <FaUsers className="text-indigo-300" />
            Number of Players
          </label>
          <select
            name="players"
            required
            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all cursor-pointer border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400`}
          >
            <option value="" className="bg-gray-800">
              Select number of players
            </option>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
              <option key={p} value={p} className="bg-gray-800">
                {p} Players
              </option>
            ))}
          </select>
        </div>

        {/* Create Button */}
        <button
          type="submit"
          className="w-full bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
        >
          <FaUserPlus />
          Create Room
        </button>

        {/* Info Box */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-white/50 text-xs text-center">
            <FaUserFriends className="inline mr-1" />
            Room creator becomes the host. Share room code with friends to join!
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;
