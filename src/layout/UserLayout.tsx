import { Navigate, Outlet } from "react-router-dom";
import { ChatBot } from "../components/ChatBot";
import { useAuth } from "../context/AuthContext";

export const UserLayout = () => {
  const { userRole } = useAuth();
  // if (!userRole) {
  //   return <Navigate to="/login" replace />;
  // }
  return (
    <div>
      <Outlet />
      <ChatBot />
    </div>
  );
};
