import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import useAuth from "../../store/useAuth";
import ButtonLoader from "../loaders/ButtonLoader";

const Register = () => {
  const [show, setShow] = useState({
    p: false,
    cp: false,
  });

  const { handleRegister, loading } = useAuth();

  return (
    <div>
      <form onSubmit={handleRegister} className="p-6 space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-white/40" />
            </div>
            <input
              type="text"
              name="name"
              required
              className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all
                
                  border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400
              `}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdAlternateEmail className="text-white/40" />
            </div>
            <input
              type="text"
              name="username"
              required
              className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all 
                  border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400
              `}
              placeholder="john_doe_123"
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
              type={show.p ? "text" : "password"}
              name="password"
              required
              autoComplete="off"
              className={`w-full bg-white/5 border rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400
              `}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, p: !prev.p }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60"
            >
              {show.p ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-white/40" />
            </div>
            <input
              type={show.cp ? "text" : "password"}
              name="confirmPassword"
              required
              autoComplete="off"
              className={`w-full bg-white/5 border rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all 
              border-white/20 focus:ring-indigo-400/50 focus:border-indigo-400
              `}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, cp: !prev.cp }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60"
            >
              {show.cp ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
        >
          {loading ? <ButtonLoader /> : "Create Account"}
        </button>

        <p className="text-center text-white/50 text-xs">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </div>
  );
};

export default Register;
