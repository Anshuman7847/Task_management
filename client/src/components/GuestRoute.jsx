import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../context/useAuth";

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
