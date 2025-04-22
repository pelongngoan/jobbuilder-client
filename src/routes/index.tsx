import { Navigate, RouteObject } from "react-router-dom";
import { Home } from "../pages/Home";
import { UserLayout } from "../layout/UserLayout";
import { Resumes } from "../pages/Resumes";
import { CreateResume } from "../pages/CreateResume";
import { PostJob } from "../pages/PostJob";
import { ResumeEditor } from "../pages/ResumeEditor";
import { Login as LoginUser } from "../pages/users/Login";
import { Login as LoginManager } from "../pages/managements/Login";
import { Register as RegisterUser } from "../pages/users/Register";
import { Register as RegisterManager } from "../pages/managements/Register";
import { Search } from "../pages/Search";
import { Profile } from "../pages/Profile";
import { ProtectedRoute } from "./ProtectedRoute";
import { ManagementLayout } from "../layout/ManagementLayout";

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
  element: (
    // <ProtectedRoute>
    <UserLayout />
    // </ProtectedRoute>
  ),
  children: [
    // {
    //   index: true,
    //   element: <Navigate to="/home" replace />,
    // },
    { path: "login", element: <LoginUser /> },
    { path: "c", element: <RegisterUser /> },
    { path: "home", element: <Home /> },
    { path: "resumes", element: <Resumes /> },
    { path: "search", element: <Search /> },
    { path: "profile", element: <Profile /> },
    { path: "post-job", element: <PostJob /> },
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
  ],
};

export const routes: RouteObject[] = [rootRoute, managementRoute];
