import * as yup from "yup";

export const addVehicleSchema = yup.object().shape({
  vNumber: yup.string().required("Vehicle number is required"),
  startRoute: yup.string().required("Start route is required"),
  endRoute: yup.string().required("End route is required"),
  driverId: yup.string().required("Driver is required"),
  supervisorId: yup.string().required("Supervisor is required"),
});

export const addRouteSchema = yup.object().shape({
  name: yup.string().required("Route name is required"),
});
