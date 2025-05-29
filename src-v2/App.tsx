import { useEffect } from "react";
import "./index.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Chatbot, FloatingLanguageSwitcher } from "./components/common";
import useAuth from "./hooks/useAuth";

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/user/login");
    }
  });

  return (
    <>
      <Outlet />
      {token ? <Chatbot /> : <></>}
      <FloatingLanguageSwitcher />
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
