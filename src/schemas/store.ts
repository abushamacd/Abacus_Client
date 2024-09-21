import * as yup from "yup";

export const addSupplierSchema = yup.object().shape({
  name: yup.string().required("Name number is required"),
  address: yup.string().required("Address is required"),
  ownerName: yup.string().required("Owner name is required"),
  ownerPhone: yup.string().required("Owner phone is required"),
  srName: yup.string().required("SR. name is required"),
  srPhone: yup.string().required("SR. phone is required"),
  comment: yup.string().optional(),
});

export const addUnitSchema = yup.object().shape({
  name: yup.string().required("Unit is required"),
});

export const addProductSchema = yup.object().shape({
  vNumber: yup.string().required("Vehicle number is required"),
  routes: yup.array().required("Route is required"),
  driverId: yup.string().required("Driver is required"),
  supervisorId: yup.string().required("Supervisor is required"),
});
