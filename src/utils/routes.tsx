import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { NotFound } from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import { AdminLayout } from "../layouts/AdminLayout";
import { Profile } from "../pages/Dashboard/Profile";
import { UserDetails } from "../pages/Dashboard/user/UserDetails";
import { User } from "../pages/Dashboard/user/User";
import { VehiclesOverview } from "../pages/Dashboard/vehicle/Overview";
import { Vehicle } from "../pages/Dashboard/vehicle/Vehicle";
import { VehicleRoutes } from "../pages/Dashboard/vehicle/VehicleRoutes";
import { VStatement } from "../pages/Dashboard/vehicle/VStatement";
import { VehicleDetails } from "../pages/Dashboard/vehicle/VehicleDetails";
import { Product } from "../pages/Dashboard/store/Product";
import { Supplier } from "../pages/Dashboard/store/Supplier";
import { Units } from "../pages/Dashboard/store/Unit";
import { SupplierDetails } from "../pages/Dashboard/store/SupplierDetails";
import { ProductDetails } from "../pages/Dashboard/store/ProductDetails";
import { Invoice } from "../pages/Dashboard/store/Invoice";
import { InvoiceDetails } from "../pages/Dashboard/store/InvoiceDetails";
import { StoreOverview } from "../pages/Dashboard/store/Overview";
import { MyInvoices } from "../pages/Dashboard/user/MyInvoices";
import PrivateRoute from "./PrivateRoute";
import Homepage from "../pages/Client/Homepage";
import { ForgetPassword } from "../pages/Auth/ForgetPassword";
import { ResetPassword } from "../pages/Auth/ResetPassword";
import { Activation } from "../pages/Auth/Activation";

const db_url = import.meta.env.VITE_REDIRECT_URL;

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
    ],
  },
  {
    path: `/${db_url}`,
    element: <AuthLayout />,
    children: [
      {
        path: `/${db_url}/signin`,
        element: <SignIn />,
      },
      {
        path: `/${db_url}/forget-password`,
        element: <ForgetPassword />,
      },
      {
        path: `/${db_url}/reset-password/:token`,
        element: <ResetPassword />,
      },
      {
        path: `/${db_url}/account-active/:token`,
        element: <Activation />,
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
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: `/${db_url}/myinvoices`,
        element: <MyInvoices />,
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
        path: `/${db_url}/store`,
        element: (
          <PrivateRoute>
            <StoreOverview />
          </PrivateRoute>
        ),
      },
      {
        path: `/${db_url}/invoices`,
        element: <Invoice />,
      },
      {
        path: `/${db_url}/invoices/:id`,
        element: <InvoiceDetails />,
      },
      {
        path: `/${db_url}/products`,
        element: <Product />,
      },
      {
        path: `/${db_url}/products/:id`,
        element: <ProductDetails />,
      },
      {
        path: `/${db_url}/suppliers`,
        element: <Supplier />,
      },
      {
        path: `/${db_url}/suppliers/:id`,
        element: <SupplierDetails />,
      },
      {
        path: `/${db_url}/units`,
        element: <Units />,
      },
      {
        path: `/${db_url}/vehicle`,
        element: (
          <PrivateRoute>
            <VehiclesOverview />
          </PrivateRoute>
        ),
      },
      {
        path: `/${db_url}/vehicles/`,
        element: <Vehicle />,
      },
      {
        path: `/${db_url}/vehicles/:id`,
        element: <VehicleDetails />,
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
