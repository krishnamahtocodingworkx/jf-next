import type {
  AddProductFormValues,
  ForgotPasswordFormValues,
  LoginFormValues,
  RecoveryPasswordFormValues,
  RegisterFormValues,
} from "@/utils/model";

export const LOGIN_INITIAL_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

export const FORGOT_PASSWORD_INITIAL_VALUES: ForgotPasswordFormValues = {
  email: "",
};

export const RECOVERY_PASSWORD_INITIAL_VALUES: RecoveryPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

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
