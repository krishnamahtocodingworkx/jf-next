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

export type AddProductProductStatus = "active" | "concept" | "discontinued";

/** Add Product drawer form (aligned with create-product payload fields). */
export type AddProductFormValues = {
  company: string;
  category: string;
  productType: string;
  subcategory: string;
  sku: string;
  name: string;
  brand: string;
  flavor: string;
  manufacturer: string;
  dateCreated: string;
  fulfilmentDate: string;
  servingSize: string;
  servingUnit: string;
  status: AddProductProductStatus;
  guavaEnabled: boolean;
  hasAdditives: boolean;
  guavaScore: string;
  upcCode: string;
  cost: string;
  retailCost: string;
  country: string;
  currency: string;
  objectives: string[];
  notes: string;
};

export type AddProductPickedIngredient = {
  id: string;
  jf_display_name?: string;
  weight: string;
  unit: string;
};

export type AddProductPanelProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};
