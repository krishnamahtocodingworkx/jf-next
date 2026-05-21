// Centralised type aliases (auth, forms, redux slice state, packaging UI props, service payloads).
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
  description: string;
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

/** Product types + subcategories from the category-list API. */
export type CategoryListBundle = {
  productTypes: string[];
  subCategories: string[];
};

/** Payload returned by `fetchAddProductCategoryBundle`. */
export type CategoryBundleThunkPayload = CategoryListBundle & {
  category: string;
};

/** Payload returned by `fetchAddProductSubCategoryBundle`. */
export type SubCategoryBundleThunkPayload = CategoryListBundle & {
  subCategory: string;
};

/** Payload returned by `fetchAddProductBrands`. */
export type ProductBrandListPayload = {
  items: SelectOption[];
  companyByBrandId: Record<string, string>;
};

/** Payload returned by `searchAddProductIngredients`. */
export type AddPanelIngredientSearchPayload = {
  term: string;
  page: number;
  list: ISupplierIngredient[];
  pagination: IIngredientPagination;
};

/** Standard `rejectValue` for Add Product panel API thunks. */
export type ProductApiThunkRejectValue = string;

/** Shared async-thunk config for Add Product panel API thunks. */
export type ProductApiThunkConfig = { rejectValue: ProductApiThunkRejectValue };

// ───────────────────────────── Packaging ─────────────────────────────────

/** Channel / segment tag shown on packaging rows */
export type PackagingTag = "Retail" | "Food Service" | "E-Commerce" | "Industrial";

/** Mock catalog product lifecycle for packaging association UI */
export type PackagingProductStatus = "Active" | "Concept";

export type PackageItem = {
  id: string;
  name: string;
  type: string;
  market: string;
  material: string;
  score: number | null;
  costVariance: string | null;
  tag: PackagingTag;
  associatedProducts: string[];
};

/** Product row used in packaging association flows */
export type PackagingProduct = {
  id: string;
  name: string;
  sku: string;
  status: PackagingProductStatus;
  packagingId: string | null;
};

export type SustainabilityPoint = {
  month: string;
  value: number;
};

/** SVG path point from {@link buildSustainabilityChartPoints}. */
export type PackagingSustainabilityChartPoint = {
  x: number;
  y: number;
  month: string;
  value: number;
};

export type PackagingAssociateModalCopy = {
  title: string;
  saveButton: string;
  cancelButton: string;
};

export type AssociatePackageModalProps = {
  pkg: PackageItem;
  products: PackagingProduct[];
  onClose: () => void;
  onSave: (pkgId: string, productIds: string[]) => void;
  copy: PackagingAssociateModalCopy;
};

export type PackagingDetailDrawerStatLabels = {
  type: string;
  material: string;
  market: string;
  costVariance: string;
};

export type PackagingDetailDrawerCopy = {
  statLabels: PackagingDetailDrawerStatLabels;
  costVarianceNoData: string;
  packagingScore: string;
  associatedProducts: string;
  manageLink: string;
  emptyAssociated: string;
};

export type PackageDetailDrawerProps = {
  pkg: PackageItem;
  products: PackagingProduct[];
  onClose: () => void;
  onAssociate: () => void;
  copy: PackagingDetailDrawerCopy;
  scoreBadgeCopy: PackagingScoreBadgeCopy;
};

export type PackagingScoreBadgeCopy = {
  emptyLabel: string;
};

export type PackagingScoreBadgeProps = {
  score: number | null;
  copy: PackagingScoreBadgeCopy;
};

export type PackagingSustainabilityMiniChartCopy = {
  headlineScore: string;
  deltaLabel: string;
  improvementTitle: string;
};

export type PackagingSustainabilityMiniChartProps = {
  points: SustainabilityPoint[];
  copy: PackagingSustainabilityMiniChartCopy;
  chartMax?: number;
  chartHeight?: number;
  chartWidth?: number;
  yGridValues?: readonly number[];
  yAxisLabels?: readonly number[];
};

export type PackagingDashboardActionsCopy = {
  title: string;
  notificationsPending: string;
  actionsPending: string;
  viewAll: string;
};

export type PackagingDashboardUnmatchedCopy = {
  unmatchedLabel: string;
  activeProducts: string;
  conceptProducts: string;
};

export type PackagingDashboardTableHeadersCopy = {
  packageName: string;
  costVariance: string;
  market: string;
  material: string;
  score: string;
  actions: string;
};

export type PackagingDashboardRecommendationsCopy = {
  title: string;
  matchedPackagesLineTemplate: string;
  showAllPackages: string;
  tableHeaders: PackagingDashboardTableHeadersCopy;
  associateProductsAriaTitle: string;
  viewButton: string;
  linkedProductsSingularTemplate: string;
  linkedProductsPluralTemplate: string;
};

export type PackagingDashboardAlertCopy = {
  unassignedTitleTemplate: string;
  bodyBeforeLink: string;
  linkWord: string;
  bodyAfterLink: string;
  autoMatch: string;
};

/** All user-facing copy for the packaging dashboard and its subcomponents */
export type PackagingDashboardCopy = {
  actions: PackagingDashboardActionsCopy;
  unmatched: PackagingDashboardUnmatchedCopy;
  recommendations: PackagingDashboardRecommendationsCopy;
  alert: PackagingDashboardAlertCopy;
  associateModal: PackagingAssociateModalCopy;
  detailDrawer: PackagingDetailDrawerCopy;
  scoreBadge: PackagingScoreBadgeCopy;
  sustainabilityChart: PackagingSustainabilityMiniChartCopy;
};

export type PackagingDashboardProps = {
  packages?: PackageItem[];
  products?: PackagingProduct[];
  copy?: PackagingDashboardCopy;
};
