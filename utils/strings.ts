export const AUTH_STRINGS = {
  logout: {
    successToast: "Logged out successfully",
  },
  login: {
    title: "Login",
    submit: "Login",
    submitLoading: "Logging in...",
    forgotPassword: "Forgot password?",
    needAccount: "Need an account?",
    createAccount: "Create account",
  },
  register: {
    title: "Create Account",
    submit: "Register",
    submitLoading: "Creating account...",
    hasAccount: "Already have an account?",
    login: "Login",
    successTitle: "Registration completed successfully!",
    successBodyPrefix: "Please check",
    successBodySuffix: "to verify your account. Once verified, come back and login.",
  },
  forgotPassword: {
    title: "Forgot your password?",
    subtitle: "We will send reset instructions to your email.",
    submit: "Send me instructions",
    submitLoading: "Sending...",
    backToLogin: "Back to login",
  },
  recoveryPassword: {
    title: "Reset Password",
    submit: "Change password",
    submitLoading: "Saving...",
    backToLogin: "Back to login",
    invalidLink: "Invalid or expired reset link",
  },
} as const;
