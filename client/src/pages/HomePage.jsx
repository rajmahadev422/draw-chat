import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-50 dark:bg-neutral-950 px-8">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-16 -left-20 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-5 -right-16 w-72 h-72 rounded-full bg-teal-500 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-20 w-48 h-48 rounded-full bg-orange-500 opacity-10 blur-3xl" />

      {/* Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs text-gray-500 dark:text-neutral-400">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        Live multiplayer · Draw &amp; guess together
      </div>

      {/* Title */}
      <h1 className="text-5xl font-medium tracking-tight text-center text-gray-900 dark:text-white mb-4">
        Chat, draw,{" "}
        <span className="text-purple-600 dark:text-purple-400">have fun.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base text-gray-500 dark:text-neutral-400 text-center max-w-sm leading-relaxed mb-10">
        Jump into a room, pick up the brush, and see who can guess your
        masterpiece first.
      </p>

      {/* CTA buttons */}
      <div className="flex gap-3 flex-wrap justify-center mb-14">
        <Link
          to="/room"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
        >
          ✏️ Play now
        </Link>
        <a
          href="#"
          className="flex items-center gap-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
        >
          👥 Browse rooms
        </a>
      </div>

      {/* Feature cards */}
      <div className="flex gap-3 flex-wrap justify-center">
        {[
          {
            icon: "🖌️",
            bg: "bg-purple-50 dark:bg-purple-950",
            label: "Real-time drawing",
            desc: "Smooth canvas shared with everyone in the room.",
          },
          {
            icon: "💬",
            bg: "bg-emerald-50 dark:bg-emerald-950",
            label: "Live chat",
            desc: "Guess the word and type your answer instantly.",
          },
          {
            icon: "🏆",
            bg: "bg-orange-50 dark:bg-orange-950",
            label: "Leaderboard",
            desc: "Score points, climb ranks, and claim the top spot.",
          },
        ].map(({ icon, bg, label, desc }) => (
          <div
            key={label}
            className="w-44 rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex flex-col gap-2"
          >
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg ${bg}`}
            >
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
