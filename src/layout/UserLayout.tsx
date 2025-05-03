import { Outlet } from "react-router-dom";
import { ChatBot } from "../components/ChatBot";
import { Navigation } from "../components/Navigation";

export const UserLayout = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
      <ChatBot />
    </div>
  );
};
