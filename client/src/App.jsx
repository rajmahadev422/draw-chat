import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "./store/useAuth";

const App = () => {
  const { checkUser, loading, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <main className="bg-slate-900 min-h-screen text-white">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 h-15 bg-slate-800/90 backdrop-blur-md border-b border-white/6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </div>
            <span className="text-base font-medium tracking-tight">
              Chat Draw
            </span>
          </Link>

          {/* Desktop right side */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white/6 hover:bg-white/1 border border-white/1 rounded-full pl-1.5 pr-3 py-1 text-sm text-slate-200 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[11px] font-medium text-purple-100">
                  {initials}
                </span>
                {user.name}
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-white/8 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden bg-slate-800 border-t border-white/6 px-4 py-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-medium text-purple-100">
                    {initials}
                  </span>
                  {user.name}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Page content offset for fixed nav */}
      <div className="pt-15">
        <Outlet />
      </div>
    </main>
  );
};

export default App;
