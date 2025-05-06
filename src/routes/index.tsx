import { RouteObject } from "react-router-dom";
import { Home } from "../pages/Home";
import { UserLayout } from "../layout/UserLayout";
import { Resumes } from "../pages/Resumes";
import { CreateResume } from "../pages/CreateResume";
import { ResumeEditor } from "../pages/ResumeEditor";
import { Login as LoginUser } from "../pages/users/Login";
import { Login as LoginManager } from "../pages/managements/Login";
import { Register as RegisterUser } from "../pages/users/Register";
import { Register as RegisterManager } from "../pages/managements/Register";
import { Search } from "../pages/Search";
import { Profile } from "../pages/Profile";
import { ManagementLayout } from "../layout/ManagementLayout";
import { DashboardPage } from "../pages/managements/Dashboard";
import { HrManagementPage } from "../pages/managements/HrManagementPage";
import { JobPostManagementPage } from "../pages/managements/JobPostManagementPage";
import { ApplicationsPage } from "../pages/managements/ApplicationsPage";
import { MessagesPage } from "../pages/managements/MessagesPage";
import { SettingsPage } from "../pages/managements/SettingsPage";
import JobDetail from "../pages/JobDetail";
import JobsPage from "../pages/JobsPage";

// const authRoutes: RouteObject = {
//   path: "/users",
//   element: <UserLayout />,
//   children: [
//     { path: "login", element: <Login /> },
//     { path: "register", element: <RegisterUser /> },
//   ],
// };

// Root route that redirects to login
const rootRoute: RouteObject = {
  path: "/",
  element: <UserLayout />,
  children: [
    { path: "login", element: <LoginUser /> },
    { path: "signup", element: <RegisterUser /> },
    { path: "home", element: <Home /> },
    { path: "resumes", element: <Resumes /> },
    {
      path: "search",
      element: <Search />,
    },
    { path: "search/job-detail/:id", element: <JobDetail /> },
    {
      path: "job",
      element: <JobsPage />,
    },
    { path: "profile", element: <Profile /> },
    { path: "create-resume", element: <CreateResume /> },
    { path: "resume-editor/:templateId", element: <ResumeEditor /> },
  ],
};

const managementRoute: RouteObject = {
  path: "/management",
  element: <ManagementLayout />,
  children: [
    { path: "login", element: <LoginManager /> },
    { path: "signup", element: <RegisterManager /> },
    { path: "dashboard", element: <DashboardPage /> },
    { path: "hr-management", element: <HrManagementPage /> },
    { path: "jobpost-management", element: <JobPostManagementPage /> },
    { path: "applications", element: <ApplicationsPage /> },
    { path: "messages", element: <MessagesPage /> },
    { path: "settings", element: <SettingsPage /> },
  ],
};

export const routes: RouteObject[] = [rootRoute, managementRoute];
