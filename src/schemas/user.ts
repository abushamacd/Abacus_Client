import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  due: yup.number().optional(),
  balance: yup.number().optional(),
});
export const updateUserSchema = yup.object().shape({
  name: yup.string().optional(),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  due: yup.number().optional(),
  balance: yup.number().optional(),
});
