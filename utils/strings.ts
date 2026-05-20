// User-facing strings (auth screens, packaging module, …) — bundle copy here so localisation stays centralized.
import type { PackagingDashboardCopy } from "@/utils/model";
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

/** User-facing copy for the packaging module (dashboard + drawers + modals). */
export const PACKAGING_STRINGS = {
  packagingDashboard: {
    actions: {
      title: "Packaging Actions",
      notificationsPending: "Notifications Pending",
      actionsPending: "Actions Pending",
      viewAll: "View all >>",
    },
    unmatched: {
      unmatchedLabel: "Unmatched",
      activeProducts: "Active Products",
      conceptProducts: "Concept Products",
    },
    recommendations: {
      title: "Packaging Recommendations",
      matchedPackagesLineTemplate: "{count} Matched Packages",
      showAllPackages: "Show All Packages",
      tableHeaders: {
        packageName: "Package Name",
        costVariance: "Cost Variance",
        market: "Market",
        material: "Material",
        score: "Score",
        actions: "Actions",
      },
      associateProductsAriaTitle: "Associate products",
      viewButton: "View",
      linkedProductsSingularTemplate: "{count} product linked",
      linkedProductsPluralTemplate: "{count} products linked",
    },
    alert: {
      unassignedTitleTemplate: "{count} products have no packaging assigned",
      bodyBeforeLink: "Use the ",
      linkWord: "link",
      bodyAfterLink:
        " icon or View panel to associate packaging with your products and unlock cost and sustainability insights.",
      autoMatch: "Auto-Match",
    },
    associateModal: {
      title: "Associate Products",
      saveButton: "Save Associations",
      cancelButton: "Cancel",
    },
    detailDrawer: {
      statLabels: {
        type: "Type",
        material: "Material",
        market: "Market",
        costVariance: "Cost Variance",
      },
      costVarianceNoData: "No data",
      packagingScore: "Packaging Score",
      associatedProducts: "Associated Products",
      manageLink: "Manage",
      emptyAssociated: "No products associated yet.",
    },
    scoreBadge: {
      emptyLabel: "—",
    },
    sustainabilityChart: {
      headlineScore: "80",
      deltaLabel: "+6 pts",
      improvementTitle: "Sustainability Improvement",
    },
  } satisfies PackagingDashboardCopy,
} as const;
