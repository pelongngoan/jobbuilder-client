import React from "react";
import { Navigate, RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import HRLayout from "../layout/HRLayout";
import CompanyLayout from "../layout/CompanyLayout";
import { Login } from "../pages/users/Login";
import { Home } from "../pages/Home";
import { UserLayout } from "../layout/UserLayout";
import { Resumes } from "../pages/Resumes";
import { CreateResume } from "../pages/CreateResume";
import { PostJob } from "../pages/PostJob";
import { ResumeEditor } from "../pages/ResumeEditor";
import { Register } from "../pages/users/Register";
import { Search } from "../pages/Search";
import { Profile } from "../pages/Profile";
import { ProtectedRoute } from "./ProtectedRoute";

// Placeholder components - replace these with your actual components
const Dashboard = () => <div>Dashboard</div>;
const Users = () => <div>Users</div>;
const Companies = () => <div>Companies</div>;
const Reports = () => <div>Reports</div>;
const Security = () => <div>Security</div>;
const Settings = () => <div>Settings</div>;
const Employees = () => <div>Employees</div>;
const Jobs = () => <div>Jobs</div>;
const Teams = () => <div>Teams</div>;

// Admin routes
const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "", element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "users", element: <Users /> },
    { path: "companies", element: <Companies /> },
    { path: "reports", element: <Reports /> },
    { path: "security", element: <Security /> },
    { path: "settings", element: <Settings /> },
  ],
};

// HR routes
const hrRoutes: RouteObject = {
  path: "/hr",
  element: <HRLayout />,
  children: [
    { path: "", element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "employees", element: <Employees /> },
    { path: "jobs", element: <Jobs /> },
    { path: "settings", element: <Settings /> },
  ],
};

// Company routes
const companyRoutes: RouteObject = {
  path: "/company",
  element: <CompanyLayout />,
  children: [
    { path: "", element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "profile", element: <Profile /> },
    { path: "jobs", element: <Jobs /> },
    { path: "teams", element: <Teams /> },
    { path: "settings", element: <Settings /> },
  ],
};

// Auth routes
const authRoutes: RouteObject = {
  path: "/users",
  element: <UserLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
  ],
};

const companyAuthRoutes: RouteObject = {
  path: "/company",
  element: <CompanyLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
  ],
};

const hrAuthRoutes: RouteObject = {
  path: "/hr",
  element: <HRLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
  ],
};

const adminAuthRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [{ path: "login", element: <Login /> }],
};

// Root route that redirects to login
const rootRoute: RouteObject = {
  path: "/",
  element: <UserLayout />,
  children: [
    {
      path: "home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    { path: "resumes", element: <Resumes /> },
    { path: "search", element: <Search /> },
    { path: "profile", element: <Profile /> },
    { path: "post-job", element: <PostJob /> },
    { path: "create-resume", element: <CreateResume /> },
    { path: "resume-editor/:templateId", element: <ResumeEditor /> },
  ],
};

export const routes: RouteObject[] = [
  rootRoute,
  authRoutes,
  adminRoutes,
  hrRoutes,
  companyRoutes,
];
