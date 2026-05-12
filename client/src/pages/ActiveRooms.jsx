import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";
import useRoom from "../store/useRoom";

const STATUS_STYLES = {
  open: { dot: "bg-emerald-500", label: "Open" },
  waiting: { dot: "bg-amber-500", label: "Waiting" },
  full: { dot: "bg-neutral-500", label: "Full" },
};

const AVATAR_COLORS = [
  "bg-purple-200 text-purple-900",
  "bg-teal-200 text-teal-900",
  "bg-orange-200 text-orange-900",
  "bg-pink-200 text-pink-900",
  "bg-blue-200 text-blue-900",
  "bg-amber-200 text-amber-900",
];

export default function ActiveRooms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const {io} = useRoom();

  useEffect(() => {
    if(!io) return;
    io.emit("get-rooms");
    io.on("rooms-list", (data) => {
      setRooms(Object.values(data));
      console.log(Object.values(data));
    });
    return () => io.off("rooms-list");
  }, [io]);

  const filtered = rooms.filter((r) => {
    const matchFilter = filter === "all" || r.status === filter;
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.id?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const join = (room) => {
    if (room.locked) {
      // handle password prompt
    }
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-medium text-white">Game lobby</h1>
            <p className="text-sm text-white/45 mt-0.5">
              Join a room or create your own
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rooms…"
                className="pl-8 pr-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/25 outline-none focus:border-purple-500/50 w-44 transition-colors"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 bg-white/4 border border-white/8 rounded-lg p-1">
              {["all", "open", "waiting"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? "bg-white/10 text-white border border-white/10"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate("/room")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-sm font-medium text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              New room
            </button>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            {
              label: `${rooms.filter((r) => r.status === "open").length} open`,
              color: "bg-emerald-500",
            },
            {
              label: `${rooms.filter((r) => r.status === "waiting").length} waiting`,
              color: "bg-amber-500",
            },
            {
              label: `${rooms.filter((r) => r.status === "full").length} full`,
              color: "bg-neutral-500",
            },
          ].map(({ label, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-xs text-white/45 bg-white/4 border border-white/[0.07] rounded-full px-3 py-1"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
              {label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs text-white/30 bg-white/4 border border-white/[0.07] rounded-full px-3 py-1 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/20">
            <svg
              className="mx-auto mb-3"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15s1.5-2 4-2 4 2 4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <p className="text-sm">No rooms match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((room) => {
              const isFull = room.status === "full";
              const { dot } = STATUS_STYLES[room.status] || STATUS_STYLES.open;
              return (
                <div
                  key={room.id}
                  className={`bg-slate-900 border border-white/[0.07] rounded-xl p-4 flex flex-col gap-3 hover:border-white/[0.14] transition-colors ${isFull ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {room.name}
                      </p>
                      <span className="text-[11px] text-white/30 font-mono">
                        #{room.id}
                      </span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 mt-1 ${dot}`}
                      title={room.status}
                    />
                  </div>

                  {/* Avatars */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {room.players?.slice(0, 4).map((p, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full text-[10px] font-medium flex items-center justify-center border-2 border-slate-900 -ml-1.5 first:ml-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                        >
                          {p.name?.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {room.players?.length > 4 && (
                        <div className="w-6 h-6 rounded-full text-[10px] font-medium flex items-center justify-center border-2 border-slate-900 -ml-1.5 bg-white/10 text-white/50">
                          +{room.players.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-white/35">
                      {room.players?.length}/{room.max}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/6">
                    <span className="flex items-center gap-1 text-[11px] text-white/30">
                      {room.locked ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="18" height="11" x="3" y="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>{" "}
                          Private
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>{" "}
                          Public
                        </>
                      )}
                    </span>
                    {!isFull && (
                      <button
                        onClick={() => join(room)}
                        className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg border transition-colors ${
                          !room.locked
                            ? "bg-purple-700 border-purple-700 text-purple-100 hover:bg-purple-600"
                            : "border-white/10 text-white/50 hover:bg-white/6"
                        }`}
                      >
                        {room.locked ? "Request" : "Join"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
