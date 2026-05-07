import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import useAuth from "../../store/useAuth";
import ButtonLoader from "../loaders/ButtonLoader";

const Login = () => {

  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const { handleLogin, loading } = useAuth();
  
    
  return (
    <div>
      <form onSubmit={handleLogin} className="p-6 space-y-5">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-white/40" />
            </div>
            <input
              type="text"
              name="username"
              required
              className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400
              `}
              placeholder="you@exampl"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-white/40" />
            </div>
            <input
              type={showLoginPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="off"
              className={`w-full bg-white/5 border rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all
              border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400
              `}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60"
            >
              {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded bg-white/5 border-white/20 text-indigo-500 focus:ring-indigo-500/50"
            />
            <span className="text-white/70 text-sm">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-indigo-300 hover:text-indigo-200 transition"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full text-center bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
        >
          {loading ? <ButtonLoader /> : "Sign In"}
        </button>

      </form>
    </div>
  );
};

export default Login;
