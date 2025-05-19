import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import App from "../App";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ManagerLayout from "../components/layouts/ManagerLayout";
import UserLayout from "../components/layouts/UserLayout";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";
import { ManageProfile } from "../pages/manager/ManageProfile";
import { ManageStaffs } from "../pages/manager/ManageStaffs";
import { ManageJobs } from "../pages/manager/ManageJobs";
import { ManageCategories } from "../pages/manager/ManageCategories";
import { ManageApplications } from "../pages/manager/ManageApplications";
import { ManageUsers } from "../pages/manager/ManageUsers";
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
        element: <ManagerLayout />,
        children: [
          {
            index: true,
            path: "",
            element: <ManagerDashboard />,
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
          {
            path: "profile",
            element: <ManageProfile />,
          },
          {
            path: "staffs",
            element: <ManageStaffs />,
          },
          {
            path: "jobs",
            element: <ManageJobs />,
          },
          {
            path: "categories",
            element: <ManageCategories />,
          },
          {
            path: "applications",
            element: <ManageApplications />,
          },
          {
            path: "users",
            element: <ManageUsers />,
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
