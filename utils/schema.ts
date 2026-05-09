import * as Yup from "yup";
import { AUTH_CONSTANTS } from "@/utils/constants";
import {
  emailRegExp,
  passRegExp,
  passwordError,
  phoneRegExp,
  nameRegExp,
} from "@/utils/validation";

/**
 * Yup schemas as factories (same pattern as purpose-codes-platform-user-panel `schema.ts`).
 * Cached instances exported as `loginSchema`, etc. for Formik.
 */

export const LoginSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Enter the required field")
      .matches(emailRegExp, "Please enter valid Email"),
    password: Yup.string()
      .trim()
      .required("Enter the required field")
      .max(16, "Password should be maximum of 16 characters")
      .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password should be minimum of ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
      .matches(passRegExp, passwordError),
  });

export const RegisterSchema = () =>
  Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("Enter your first name")
      .min(2, "First name should be minimum of 2 characters")
      .max(20, "First name should be maximum of 20 characters")
      .matches(nameRegExp, "Please enter a valid name"),
    lastName: Yup.string()
      .trim()
      .required("Enter your last name")
      .min(2, "Last name should be minimum of 2 characters")
      .max(20, "Last name should be maximum of 20 characters")
      .matches(nameRegExp, "Please enter a valid name"),
    company: Yup.string().trim().required("Company is required"),
    companyType: Yup.string().trim().required("Company type is required"),
    phoneNumber: Yup.string()
      .trim()
      .required("Enter your phone number")
      .matches(phoneRegExp, "Please enter a valid phone number."),
    jobTitle: Yup.string().trim().required("Job Title is required"),
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),
    country: Yup.string().trim().required("Country is required"),
    email: Yup.string()
      .trim()
      .required("Enter the required field")
      .matches(emailRegExp, "Please enter valid Email"),
    password: Yup.string()
      .trim()
      .required("Enter the required field")
      .max(16, "Password should be maximum of 16 characters")
      .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password should be minimum of ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
      .matches(passRegExp, passwordError),
    confirmPassword: Yup.string()
      .trim()
      .required("Enter the required field")
      .oneOf([Yup.ref("password")], "Password and Confirm Password must match"),
  });

export const ForgotPasswordSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Enter the required field")
      .matches(emailRegExp, "Please enter valid Email"),
  });

export const RecoveryPasswordSchema = () =>
  Yup.object().shape({
    password: Yup.string()
      .trim()
      .required("Enter the required field")
      .max(16, "Password should be maximum of 16 characters")
      .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password should be minimum of ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
      .matches(passRegExp, passwordError),
    confirmPassword: Yup.string()
      .trim()
      .required("Enter the required field")
      .oneOf([Yup.ref("password")], "Password and Confirm Password must match"),
  });

/** Cached schemas for Formik `validationSchema` prop */
export const loginSchema = LoginSchema();
export const registerSchema = RegisterSchema();
export const forgotPasswordSchema = ForgotPasswordSchema();
export const recoveryPasswordSchema = RecoveryPasswordSchema();
