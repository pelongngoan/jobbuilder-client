import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { useAuth } from "../../hooks/useAuth";
import { useSaveJob } from "../../hooks/useSaveJob";
import { useEffect } from "react";
import { useApplication } from "../../hooks/useApplication";
const UserLayout = () => {
  const { token } = useAuth();
  const { getSavedJobs } = useSaveJob();
  const { getUserApplications } = useApplication();

  useEffect(() => {
    if (token) {
      getSavedJobs();
      getUserApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div className="flex flex-col min-h-screen">
      {token ? <NavBar variant="light" /> : <></>}
      <main className={`${token ? "mt-16 flex-1" : ""}`}>
        <Outlet />
      </main>
      {token ? (
        <footer className="footer py-4 bg-gray-100 text-center">
          <div className="container mx-auto px-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} JobBuilder. All rights reserved.
            </p>
          </div>
        </footer>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserLayout;
