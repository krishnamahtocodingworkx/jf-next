import type {
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
