import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { HomePage } from "../pages/HomePage";
import App from "../App";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ManagerLayout from "../components/layouts/ManagerLayout";
import UserLayout from "../components/layouts/UserLayout";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "user",
        children: [
          {
            path: "",
            index: true,
            element: <UserLayout />,
          },
          {
            path: "login",
            element: <LoginPage variant="user" />,
          },
          {
            path: "register",
            element: <RegisterPage variant="user" />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage variant="user" />,
          },
        ],
      },
      {
        path: "manager",
        children: [
          {
            index: true,
            path: "",
            element: <ManagerLayout />,
          },
          {
            path: "login",
            element: <LoginPage variant="manager" />,
          },
          {
            path: "register",
            element: <RegisterPage variant="manager" />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage variant="manager" />,
          },
          {
            path: "dashboard",
            element: <ManagerDashboard />,
          },
        ],
      },
      {
        path: "verify-email/:token",
        element: <VerifyEmailPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },

      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
    ],
  },
]);
