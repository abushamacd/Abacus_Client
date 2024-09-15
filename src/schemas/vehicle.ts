import * as yup from "yup";

export const addVehicleSchema = yup.object().shape({
  vNumber: yup.string().required("Vehicle number is required"),
  routes: yup.array().required("Route is required"),
  driverId: yup.string().required("Driver is required"),
  supervisorId: yup.string().required("Supervisor is required"),
});

export const addRouteSchema = yup.object().shape({
  name: yup.string().required("Route name is required"),
});

export const addVStatementSchema = yup.object().shape({
  vehicleId: yup.string().required("Vehicle is required"),
  routes: yup.array().required("Route is required"),
  date: yup.string().required("Please re-select the data to confirm"),
  oil: yup.number().required("Oil is required"),
  income: yup.number().required("Income is required"),
  expense: yup.number().required("Expense is required"),
  welfare: yup.number().required("Welfare cost is required"),
  servicing: yup.number().required("Servicing cost is required"),
});
