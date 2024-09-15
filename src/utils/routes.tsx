import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { NotFound } from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";
// import ProtectedRoute from "./ProtectedRoute";
import { AdminLayout } from "../layouts/AdminLayout";
import { Profile } from "../pages/Dashboard/Profile";
import { UserDetails } from "../pages/Dashboard/user/UserDetails";
import { User } from "../pages/Dashboard/user/User";
import { VehiclesOverview } from "../pages/Dashboard/vehicle/Overview";
import { Vehicle } from "../pages/Dashboard/vehicle/Vehicle";
import { VehicleRoutes } from "../pages/Dashboard/vehicle/VehicleRoutes";
import { VStatement } from "../pages/Dashboard/vehicle/VStatement";

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
      {
        path: `/${db_url}/vehicle/`,
        element: <VehiclesOverview />,
      },
      {
        path: `/${db_url}/vehicles/`,
        element: <Vehicle />,
      },
      {
        path: `/${db_url}/vehicle-routes/`,
        element: <VehicleRoutes />,
      },
      {
        path: `/${db_url}/vehicle-statement/`,
        element: <VStatement />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
