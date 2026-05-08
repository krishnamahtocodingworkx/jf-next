import * as yup from "yup";
import { AUTH_CONSTANTS } from "@/utils/constants";

export const loginSchema = yup.object({
  email: yup.string().required("Email is required").email("Please enter a valid email"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  company: yup.string().required("Company is required"),
  companyType: yup.string().required("Company type is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
  jobTitle: yup.string().required("Job Title is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  email: yup.string().required("Email is required").email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().required("Email is required").email("Please enter a valid email"),
});

export const recoveryPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
