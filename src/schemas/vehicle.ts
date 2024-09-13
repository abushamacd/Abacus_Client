import * as yup from "yup";

export const addVehicleSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export const addRouteSchema = yup.object().shape({
  name: yup.string().required("Route name is required"),
});
