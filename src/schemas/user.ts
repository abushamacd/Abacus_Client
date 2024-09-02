import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
});
