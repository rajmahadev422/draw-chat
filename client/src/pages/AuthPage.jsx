import { useState, useEffect } from "react";

import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import useAuth from "../store/useAuth";
import { use } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  // State for active tab based on hash route
  const [activeTab, setActiveTab] = useState("login");

  const {user, checkUser} = useAuth();

useEffect(() => {
checkUser();
},[]);

  // Update hash when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const navigate = useNavigate();
  if(user) return navigate("/"); // Redirect to home if already logged in
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        {/* Glass morphism card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with Logo */}
          <div className="text-center pt-8 pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">ChatDash</h1>
            <p className="text-white/70 text-sm">Connect, Chat, Collaborate</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/20">
            <button
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative ${
                activeTab === "login"
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Login
              {activeTab === "login" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-400 to-purple-400 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative ${
                activeTab === "register"
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Register
              {activeTab === "register" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-400 to-purple-400 rounded-full"></div>
              )}
            </button>
          </div>

          {/* Success Message */}
          {/* {successMessage && (
            <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-2">
              <FaCheckCircle className="text-emerald-400 shrink-0" />
              <span className="text-emerald-100 text-sm">{successMessage}</span>
            </div>
          )} */}

          {/* Login Form */}
          {activeTab === "login" && <Login />}

          {/* Register Form */}
          {activeTab === "register" && <Register />}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/40 text-xs mt-6">
          Secure authentication • Data logged to console for demo purposes
        </p>
      </div>
    </div>
  );
}
