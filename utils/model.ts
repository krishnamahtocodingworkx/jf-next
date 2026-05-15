// Centralised type aliases (auth, forms, redux slice state, service payloads).
// Interfaces live in `interfaces/<module>.ts`; only `type` declarations live here.
import type { ISupplierIngredient, IIngredientPagination } from "@/interfaces/ingredient";
import type { IProduct } from "@/interfaces/product";

// ───────────────────────── Generic UI primitives ─────────────────────────

/** Generic `{ value, label }` shape used by every native `<select>` / chevron-select dropdown. */
export type SelectOption = {
  value: string;
  label: string;
};

/** Lifecycle status reused by every async slice field. */
export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

// ───────────────────────────── Compliance ──────────────────────────────

/** Compliance rollup status used by product / ingredient compliance views. */
export type ComplianceStatus = "compliant" | "review-needed" | "blocked" | "pending";

/** Severity tier for a regulatory rule violation. */
export type RuleSeverity = "critical" | "warning" | "info";

/** Recognised regulatory body / publishing source for rules. */
export type RegulatorySource =
    | "FDA"
    | "EFSA"
    | "EU"
    | "USDA"
    | "FSANZ"
    | "Health Canada"
    | "UK FSA"
    | "Codex";

// ────────────────────────────── Auth ───────────────────────────────────

/** Mirrors Firebase's auth lifecycle in our Redux store. */
export type AuthState = "signed_out" | "signed_in";

/** Body sent to `POST /users/register` from the Register page Formik form. */
export type RegisterPayload = {
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
  role: string;
};

/** Subset of the Firebase auth error shape we care about (error.code + MFA challenge data). */
export type FirebaseAuthError = {
  code?: string;
  message?: string;
  resolver?: unknown;
  customData?: { _tokenResponse?: { mfaInfo?: Array<{ phoneInfo?: string }> } };
};

// ──────────────────────────── Auth forms ────────────────────────────────

/** Login form. */
export type LoginFormValues = {
  email: string;
  password: string;
};

/** Forgot-password form. */
export type ForgotPasswordFormValues = {
  email: string;
};

/** Recovery / reset-password form. */
export type RecoveryPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

/** Register form. */
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

// ──────────────────────────── Ingredients ──────────────────────────────

/** Status pill chosen on the catalog header. */
export type IngredientStatusFilter = "all" | "active" | "concept" | "flagged";

/** Physical-form pill — matches `inferIngredientForm` output. */
export type IngredientFormFilter = "all" | "powder" | "liquid" | "puree" | "granule" | "crystal";

/** Use-case pill — matches `inferIngredientCategory` output. */
export type IngredientCategoryFilter =
  | "all"
  | "food"
  | "beverages"
  | "cosmetic"
  | "household"
  | "supplement";

/** Dropdown caches for the Add Ingredient form. */
export type IngredientAddFormOptionsState = {
  countries: SelectOption[];
  companies: SelectOption[];
  status: LoadStatus;
};

/** Shape returned by every paginated ingredient endpoint. */
export type PaginatedIngredients = {
  list: ISupplierIngredient[];
  pagination: IIngredientPagination;
};

// ─────────────────────────────── Products ───────────────────────────────

/** Product status pill on the Add Product form. */
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

/** Row in the Add Product ingredient list (id may be a real ingredient or a `custom:` placeholder). */
export type AddProductPickedIngredient = {
  id: string;
  jf_display_name?: string;
  weight: string;
  unit: string;
};

/** Props for the Add Product side panel — parent controls mount lifecycle and listens for the success callback. */
export type AddProductPanelProps = {
  onClose: () => void;
  onCreated?: () => void;
};

/** Product status pill on the catalog header (server-driven filter). */
export type CatalogFilterA = "all" | "active" | "concept" | "discontinued";

/** Product category pill (client-side keyword filter, see `filterBMatches`). */
export type CatalogFilterB = "all" | "bars" | "beverages" | "powders" | "snacks" | "supplements";

/** Generic lazy-loaded dropdown state used by Add Product fields. */
export type AddPanelListField = {
  status: LoadStatus;
  items: SelectOption[];
};

/** Product types + subcategories for a category-list row. */
export type AddPanelCategoryBundle = {
  status: LoadStatus;
  productTypes: string[];
  subCategories: string[];
};

/** Typeahead state for the ingredient search inside Add Product. */
export type AddPanelIngredientSearch = {
  status: LoadStatus;
  term: string;
  page: number;
  list: ISupplierIngredient[];
  pagination: IIngredientPagination;
};

/** Brand dropdown + reverse lookup so picking a brand auto-fills the company on submit. */
export type AddPanelBrandsState = {
  status: LoadStatus;
  items: SelectOption[];
  enrichment: "idle" | "loading" | "done";
  /** Brand id → company id from the list API (for `company_id` on submit). */
  companyByBrandId: Record<string, string>;
};

/** Aggregated state for the Add Product side panel — each field has its own lazy fetch lifecycle. */
export type ProductAddPanelState = {
  companyTypes: AddPanelListField;
  rootCategories: AddPanelListField;
  categoryBundles: Record<string, AddPanelCategoryBundle>;
  subCategoryBundles: Record<string, AddPanelCategoryBundle>;
  brands: AddPanelBrandsState;
  manufacturers: AddPanelListField;
  countries: AddPanelListField;
  currencies: AddPanelListField;
  ingredients: AddPanelIngredientSearch;
};

/** Combined slice shape stored under `state.product`. */
export type ProductState = {
  catalog: {
    list: Record<string, unknown>[];
    total: number;
    page: number;
    totalPages: number;
    nextHit: boolean;
    limit: number;
    loadStatus: LoadStatus;
    search: string;
    filterA: CatalogFilterA;
    filterB: CatalogFilterB;
    displayMode: "grid" | "list";
  };
  detail: {
    id: string | null;
    data: IProduct | undefined;
    status: LoadStatus;
  };
  addPanel: ProductAddPanelState;
};

/** Filter inputs accepted by the catalog list endpoint. */
export type ProductsPageParams = {
  page?: number;
  limit?: number;
  brandId?: string;
  productStatus?: boolean;
  category?: string;
  search?: string;
};

/** Normalized response consumed by the product catalog Redux slice. */
export type ProductsPageResponse = {
  list: Record<string, unknown>[];
  total: number;
  page: number;
  totalPages: number;
  nextHit: boolean;
  limit: number;
};
