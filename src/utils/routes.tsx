import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { NotFound } from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import { AdminLayout } from "../layouts/AdminLayout";

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
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
