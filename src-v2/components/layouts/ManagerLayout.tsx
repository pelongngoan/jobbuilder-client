import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const title = "Manager";
  const userRole = "manager";
  const { token } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      {token ? (
        <Sidebar
          title={title}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          activeColor="bg-blue-700"
          hoverColor="hover:bg-gray-700"
          userRole={userRole}
        />
      ) : (
        <></>
      )}
      <main>
        {token ? (
          <div
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? "ml-64" : "ml-20"
            }`}
          >
            <Outlet />
          </div>
        ) : (
          <>
            <Outlet />
          </>
        )}
      </main>
    </div>
  );
};

export default ManagerLayout;
