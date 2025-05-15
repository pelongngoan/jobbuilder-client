import { useEffect } from "react";
import "./index.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import toast, { Toaster } from "react-hot-toast";
export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = useSelector((state: RootState) => state.toast);
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/user");
    }
  });
  if (message) {
    toast.success(message);
  }
  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 3000 },
        }}
      />
    </>
  );
};

export default App;
