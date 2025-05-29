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
import { HomePage } from "../pages/users/HomePage";
import { JobListPage } from "../pages/users/JobListPage";
import JobDetails from "../pages/users/JobDetails";
import JobByCategory from "../pages/users/JobByCategory";
import { ResumeBuilder } from "../pages/users/ResumeBuilder";
import { ResumeListPage } from "../pages/users/ResumeListPage";
import { CompanyList } from "../pages/users/CompanyList";
import { CompanyDetail } from "../pages/users/CompanyDetail";
import { ProfilePage } from "../pages/users/ProfilePage";
import { ApplicationListPage } from "../pages/users/ApplicationListPage";
import { SaveJobsPage } from "../pages/users/SaveJobsPage";
import { JobSearchPage } from "../pages/users/JobSearchPage";
import ChatPage from "../pages/users/ChatPage";
import NotificationsPage from "../pages/users/NotificationsPage";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "user",
        element: <UserLayout />,
        children: [
          {
            path: "",
            index: true,
            element: <HomePage />,
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
          {
            path: "jobs",
            element: <JobListPage />,
          },
          {
            path: "jobs/:jobId",
            element: <JobDetails />,
          },
          {
            path: "jobs/category/:categoryId",
            element: <JobByCategory />,
          },
          {
            path: "resumes",
            element: <ResumeListPage />,
          },
          {
            path: "resumes/create",
            element: <ResumeBuilder />,
          },
          {
            path: "resumes/edit/:resumeId",
            element: <ResumeBuilder />,
          },
          {
            path: "companies",
            element: <CompanyList />,
          },
          {
            path: "companies/:companyId",
            element: <CompanyDetail />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "applications",
            element: <ApplicationListPage />,
          },
          {
            path: "saved-jobs",
            element: <SaveJobsPage />,
          },
          {
            path: "jobs/search",
            element: <JobSearchPage />,
          },
          {
            path: "chat/:chatId",
            element: <ChatPage />,
          },
          {
            path: "chat",
            element: <ChatPage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
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
          {
            path: "chat",
            element: <ChatPage />,
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
