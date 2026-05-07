import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../store/useAuth";

const ProtectedRoute = () => {
  const { user, userLoading } = useAuth();
  const location = useLocation();

  if (userLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login, but save the current location so we can come back later
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;