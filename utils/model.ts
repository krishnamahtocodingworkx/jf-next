export type LoginFormValues = {
  email: string;
  password: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type RecoveryPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  company: string;
  companyType: string;
  phoneNumber: string;
  jobTitle: string;
  city: string;
  state: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SelectOption = {
  value: string;
  label: string;
};
export interface ApiResponse<T = any> {
  message: string;
  data: T;
  code: number;
  status: string;
  timestamp: string | number;
}
