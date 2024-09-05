import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { NotFound } from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";
// import ProtectedRoute from "./ProtectedRoute";
import { AdminLayout } from "../layouts/AdminLayout";
import { Profile } from "../pages/Dashboard/Profile";
import { User } from "../pages/Dashboard/User";
import { UserDetails } from "../pages/Dashboard/UserDetails";

const db_url = import.meta.env.VITE_REDIRECT_URL;

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SiteLayout />,
  },
  {
    path: `/${db_url}_signin`,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
    ],
  },
  {
    path: `/${db_url}`,
    element: (
      // <ProtectedRoute>
      <AdminLayout />
      // </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: `/${db_url}/users`,
        element: <User />,
      },
      {
        path: `/${db_url}/users/:id`,
        element: <UserDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
