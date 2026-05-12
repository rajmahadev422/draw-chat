import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import useAuth from "../store/useAuth";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, checkUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-600 opacity-15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-pink-600 opacity-15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600 opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/7 backdrop-blur-xl border border-white/13 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="text-center px-6 pt-8 pb-5">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
              ✏️
            </div>
            <h1 className="text-xl font-medium text-white mb-1">Chat Draw</h1>
            <p className="text-xs text-white/45">
              Connect, draw, and have fun together
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/9]">
            {[
              { key: "login", label: "Login" },
              { key: "register", label: "Register" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-3.5 text-sm font-medium relative transition-colors ${
                  activeTab === key
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-[10%] right-[10%] h-0.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500" />
                )}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="p-5">
            {activeTab === "login" ? (
              <>
                <Login />
                <p className="text-center text-xs text-white/40 mt-4">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Register
                  </button>
                </p>
              </>
            ) : (
              <>
                <Register />
                <p className="text-center text-xs text-white/40 mt-4">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Login
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-white/20 text-[11px] mt-5">
          Secure authentication · Demo purposes only
        </p>
      </div>
    </div>
  );
}
