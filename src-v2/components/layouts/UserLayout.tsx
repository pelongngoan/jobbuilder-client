import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { useAuth } from "../../hooks/useAuth";

const UserLayout = () => {
  const { token } = useAuth();
  return (
    <div className="user-layout flex flex-col min-h-screen">
      {token ? <NavBar variant="light" /> : <></>}
      <main className="flex-grow pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      <footer className="footer py-4 bg-gray-100 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} JobBuilder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
