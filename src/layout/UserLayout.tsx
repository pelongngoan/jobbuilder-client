import { Outlet } from "react-router-dom";
import { ChatBot } from "../components/ChatBot";

export const UserLayout = () => {
  return (
    <div>
      <Outlet />
      <ChatBot />
    </div>
  );
};
