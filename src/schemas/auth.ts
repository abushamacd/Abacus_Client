import * as yup from "yup";

export const signInSchema = yup.object().shape({
  phone: yup.string().required("Phone is required"),
  password: yup
    .string()
    .min(6, "Password at least 6 characters")
    .max(32, "Password at most 32 characters")
    .required("Password is required"),
});

export const forgetPasswordSchema = yup.object().shape({
  email: yup.string().required("Email is required"),
});

export const passwordSchema = yup.object().shape({
  oldPassword: yup.string().min(6).max(32).required("Old password is required"),
  newPassword: yup.string().min(6).max(32).required("New password is required"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(32, "New password must be at most 32 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .min(6, "Confirm password must be at least 6 characters")
    .max(32, "Confirm password must be at most 32 characters")
    .required("Confirm password is required"),
});
