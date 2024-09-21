import * as yup from "yup";

export const addProductSchema = yup.object().shape({
  vNumber: yup.string().required("Vehicle number is required"),
  routes: yup.array().required("Route is required"),
  driverId: yup.string().required("Driver is required"),
  supervisorId: yup.string().required("Supervisor is required"),
});
