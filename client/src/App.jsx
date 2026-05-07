import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "./store/useAuth";

const App = () => {

  const {checkUser, loading, user, logout} = useAuth();

  useEffect(() => {
    checkUser();

  }, []);

  return (
    <main className="bg-slate-900 min-h-screen min-w-screen text-white">
      <section className="h-15 z-100 fixed top-0 bg-slate-700 backdrop-blur-2xl w-screen flex items-center justify-between px-4">
        <Link to='/' className="text-3xl font-bold">Chat Draw</Link>
        {user ? <button onClick={logout}>{user.name}</button> : <Link to="/auth" className="text-2xl">
          Login
        </Link>}
      </section>
      <Outlet />
    </main>
  );
};

export default App;
