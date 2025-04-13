import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Register } from "../pages/Register";
import { Home } from "../pages/Home";
import { Resumes } from "../pages/Resumes";
import { Search } from "../pages/Search";
import { Profile } from "../pages/Profile";
import { PostJob } from "../pages/PostJob";
import { CreateResume } from "../pages/CreateResume";
import { ResumeEditor } from "../pages/ResumeEditor";
import { Login } from "@mui/icons-material";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/resumes",
        element: <Resumes />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/post-job",
        element: <PostJob />,
      },
      {
        path: "/create-resume",
        element: <CreateResume />,
      },
      {
        path: "/resume-editor/:templateId",
        element: <ResumeEditor />,
      },
    ],
  },
]);
