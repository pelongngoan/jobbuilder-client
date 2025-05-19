import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const title = "Manager";
  const userRole = "manager";
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        title={title}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeColor="bg-blue-700"
        hoverColor="hover:bg-gray-700"
        userRole={userRole}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <main className="p-6 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
