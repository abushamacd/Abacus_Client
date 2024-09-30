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

export const createInvoiceSchema = yup.object().shape({
  name: yup.string().required("Customer is required"),
  date: yup.string().required("Re-select date to confirm"),
  profit: yup.number().required("Profit is required"),
  quantity: yup.number().required("quantity is required"),
  total: yup.number().required("total is required"),
  amount: yup.number().required("amount is required"),
});

export const addProductSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  supplierId: yup.string().optional(),
  unitId: yup.string().required("Unit ID is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .integer()
    .min(0, "Quantity must be at least 0"),
  minQuantity: yup
    .number()
    .required("Minimum quantity is required")
    .integer()
    .min(0, "Minimum quantity must be at least 0"),
  purchase: yup
    .number()
    .required("Purchase price is required")
    .integer()
    .min(0, "Purchase price must be at least 0"),
  sell: yup
    .number()
    .required("Sell price is required")
    .integer()
    .min(0, "Sell price must be at least 0"),
  retail: yup
    .number()
    .required("Retail price is required")
    .integer()
    .min(0, "Retail price must be at least 0"),
  comment: yup.string().optional(),
});
