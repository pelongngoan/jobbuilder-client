import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const ManagerLayout = () => {
  return (
    <div className="manager-layout flex flex-col min-h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default ManagerLayout;
