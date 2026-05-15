// Default Formik values for every form — keep them here so resetting/re-mounting is consistent.
import type {
  AddProductFormValues,
  ForgotPasswordFormValues,
  LoginFormValues,
  RecoveryPasswordFormValues,
  RegisterFormValues,
} from "@/utils/model";

/** Login form defaults. */
export const LOGIN_INITIAL_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

/** Forgot-password form defaults. */
export const FORGOT_PASSWORD_INITIAL_VALUES: ForgotPasswordFormValues = {
  email: "",
};

/** Recovery form defaults. */
export const RECOVERY_PASSWORD_INITIAL_VALUES: RecoveryPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

/** Register form defaults. */
export const REGISTER_INITIAL_VALUES: RegisterFormValues = {
  firstName: "",
  lastName: "",
  company: "",
  companyType: "",
  phoneNumber: "",
  jobTitle: "",
  city: "",
  state: "",
  country: "",
  email: "",
  password: "",
  confirmPassword: "",
};

/** Add Product side-panel defaults; `unit` defaults align with the ingredient weight chooser. */
export const ADD_PRODUCT_INITIAL_VALUES: AddProductFormValues = {
  company: "",
  category: "",
  productType: "",
  subcategory: "",
  sku: "",
  name: "",
  brand: "",
  flavor: "",
  manufacturer: "",
  dateCreated: "",
  fulfilmentDate: "",
  servingSize: "0",
  servingUnit: "g",
  status: "active",
  guavaEnabled: true,
  hasAdditives: false,
  guavaScore: "",
  upcCode: "",
  cost: "0",
  retailCost: "0",
  country: "",
  currency: "",
  objectives: [],
  notes: "",
};
