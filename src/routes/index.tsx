import React from "react";
import { Navigate, RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import HRLayout from "../layout/HRLayout";
import CompanyLayout from "../layout/CompanyLayout";
import { Login } from "../pages/Login";

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
const Profile = () => <div>Profile</div>;

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
  path: "/login",
  element: <Login />,
};

// Root route that redirects to login
const rootRoute: RouteObject = {
  path: "/",
  element: <Navigate to="/login" replace />,
};

export const routes: RouteObject[] = [
  rootRoute,
  authRoutes,
  adminRoutes,
  hrRoutes,
  companyRoutes,
];
