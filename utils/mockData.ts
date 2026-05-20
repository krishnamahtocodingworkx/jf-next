// Mock data: compliance (Overview + product detail), packaging dashboard, and shared lookups.
// Compliance interfaces: `@/interfaces/compliance`. Shared / packaging types: `@/utils/model`.
import { COMPLIANCE_REGION_DISPLAY } from "@/utils/enum";
import type {
  ComplianceStatus,
  RuleSeverity,
  PackageItem,
  PackagingProduct,
  SustainabilityPoint,
} from "@/utils/model";
import type {
  ComplianceIssue,
  Country,
  IngredientComplianceStatus,
  MarketSelection,
  ProductComplianceStatus,
  RegulatoryGuardrails,
  RegulatoryRule,
  Region,
} from "@/interfaces/compliance";

export const regulatoryRules: RegulatoryRule[] = [
  {
    id: "fda-sodium-001",
    name: "FDA Sodium Daily Value Limit",
    source: "FDA",
    description: "Sodium content must not exceed 2,300mg per daily serving for 'healthy' claims",
    regions: ["NA"],
    severity: "warning",
    category: "limits",
    nutrientLimits: [{ nutrient: "sodium", maxValue: 2300, unit: "mg" }],
    aiFix: "Consider reducing sodium by substituting with potassium chloride or reducing salt content by 15%",
  },
  {
    id: "efsa-turmeric-001",
    name: "EFSA Curcumin Intake Limit",
    source: "EFSA",
    description: "Curcumin (from turmeric) intake should not exceed 3mg/kg body weight per day",
    regions: ["EU", "UK"],
    severity: "critical",
    category: "limits",
    ingredientRestrictions: [{ ingredientId: "3", ingredientName: "Turmeric Extract", maxPercentage: 2.5 }],
    aiFix: "Reduce turmeric extract concentration to below 2.5% or add dosage warning to label",
  },
  {
    id: "eu-titanium-001",
    name: "EU Titanium Dioxide Ban",
    source: "EU",
    description: "Titanium dioxide (E171) is no longer authorized as a food additive in the EU",
    regions: ["EU"],
    severity: "critical",
    category: "ingredient",
    ingredientRestrictions: [{ ingredientId: "tio2", ingredientName: "Titanium Dioxide", banned: true }],
    aiFix: "Replace titanium dioxide with calcium carbonate or rice starch for opacity",
  },
  {
    id: "fda-protein-claim-001",
    name: "FDA Protein Content Claim",
    source: "FDA",
    description: "Products claiming 'high protein' must contain at least 20% DV of protein per RACC",
    regions: ["NA"],
    severity: "warning",
    category: "claims",
    nutrientLimits: [{ nutrient: "protein", maxValue: 10, unit: "g" }],
    aiFix: "Increase protein content to 10g per serving or remove 'high protein' claim",
  },
  {
    id: "fsanz-sugar-001",
    name: "FSANZ Added Sugar Labeling",
    source: "FSANZ",
    description: "Added sugars must be declared separately from total sugars in nutrition panel",
    regions: ["APAC"],
    severity: "info",
    category: "labeling",
    aiFix: "Update nutrition panel to show added sugars as separate line item",
  },
  {
    id: "health-canada-caffeine-001",
    name: "Health Canada Caffeine Limits",
    source: "Health Canada",
    description: "Maximum caffeine content for energy drinks is 180mg per single-serve container",
    regions: ["NA"],
    severity: "critical",
    category: "limits",
    nutrientLimits: [{ nutrient: "caffeine", maxValue: 180, unit: "mg" }],
    aiFix: "Reduce caffeine content or split into multiple servings",
  },
  {
    id: "eu-allergen-001",
    name: "EU Allergen Declaration",
    source: "EU",
    description: "All 14 major allergens must be emphasized (bold/underline) in ingredient list",
    regions: ["EU", "UK"],
    severity: "warning",
    category: "allergen",
    aiFix: "Update label to bold all allergen declarations in ingredient list",
  },
  {
    id: "fda-gluten-free-001",
    name: "FDA Gluten-Free Labeling",
    source: "FDA",
    description: "Products labeled 'gluten-free' must contain less than 20 ppm gluten",
    regions: ["NA"],
    severity: "critical",
    category: "claims",
    aiFix: "Verify gluten content through testing or remove gluten-free claim",
  },
]

// Mock compliance issues for products
export const productComplianceData: Record<string, ProductComplianceStatus> = {
  "1": {
    productId: "1",
    overallStatus: "compliant",
    regions: ["NA", "EU"],
    issues: [],
    lastChecked: "2026-01-13T10:30:00Z",
  },
  "2": {
    productId: "2",
    overallStatus: "compliant",
    regions: ["NA"],
    issues: [],
    lastChecked: "2026-01-12T14:20:00Z",
  },
  "3": {
    productId: "3",
    overallStatus: "review-needed",
    regions: ["NA", "EU"],
    issues: [
      {
        id: "issue-001",
        ruleId: "efsa-turmeric-001",
        ruleName: "EFSA Curcumin Intake Limit",
        source: "EFSA",
        severity: "critical",
        status: "review-needed",
        region: "EU",
        description: "Turmeric extract at 35% exceeds recommended curcumin limits for EU market",
        affectedItem: "Organic Turmeric",
        currentValue: "35%",
        allowedValue: "< 2.5%",
        aiFix: "Reduce turmeric extract concentration to below 2.5% or add dosage warning to label",
        detectedAt: "2026-01-11T09:00:00Z",
      },
    ],
    lastChecked: "2026-01-11T09:00:00Z",
  },
  "4": {
    productId: "4",
    overallStatus: "blocked",
    regions: ["NA", "EU", "UK"],
    issues: [
      {
        id: "issue-002",
        ruleId: "fda-sodium-001",
        ruleName: "FDA Sodium Daily Value Limit",
        source: "FDA",
        severity: "warning",
        status: "review-needed",
        region: "NA",
        description: "Sodium content exceeds recommended daily value for 'healthy' product claims",
        affectedItem: "Sea Salt",
        currentValue: "2,450mg",
        allowedValue: "< 2,300mg",
        aiFix: "Consider reducing sodium by substituting with potassium chloride or reducing salt content by 15%",
        detectedAt: "2026-01-10T16:45:00Z",
      },
      {
        id: "issue-003",
        ruleId: "eu-allergen-001",
        ruleName: "EU Allergen Declaration",
        source: "EU",
        severity: "warning",
        status: "blocked",
        region: "EU",
        description: "Allergen declarations not properly emphasized in ingredient list for EU compliance",
        affectedItem: "Product Label",
        aiFix: "Update label to bold all allergen declarations in ingredient list",
        detectedAt: "2026-01-10T16:45:00Z",
      },
    ],
    lastChecked: "2026-01-10T16:45:00Z",
  },
  "5": {
    productId: "5",
    overallStatus: "review-needed",
    regions: ["NA", "APAC"],
    issues: [
      {
        id: "issue-004",
        ruleId: "fsanz-sugar-001",
        ruleName: "FSANZ Added Sugar Labeling",
        source: "FSANZ",
        severity: "info",
        status: "pending",
        region: "APAC",
        description: "Added sugars labeling may need update for Australia/New Zealand compliance",
        affectedItem: "Nutrition Label",
        aiFix: "Update nutrition panel to show added sugars as separate line item",
        detectedAt: "2026-01-09T11:20:00Z",
      },
    ],
    lastChecked: "2026-01-09T11:20:00Z",
  },
}

// Mock compliance data for ingredients
export const ingredientComplianceData: Record<string, IngredientComplianceStatus> = {
  "1": {
    ingredientId: "1",
    overallStatus: "compliant",
    regionStatuses: [
      { regionCode: "NA", status: "compliant", issues: [] },
      { regionCode: "EU", status: "compliant", issues: [] },
      { regionCode: "APAC", status: "compliant", issues: [] },
    ],
    lastChecked: "2026-01-13T10:30:00Z",
  },
  "2": {
    ingredientId: "2",
    overallStatus: "compliant",
    regionStatuses: [
      { regionCode: "NA", status: "compliant", issues: [] },
      { regionCode: "EU", status: "compliant", issues: [] },
    ],
    lastChecked: "2026-01-12T14:20:00Z",
  },
  "3": {
    ingredientId: "3",
    overallStatus: "review-needed",
    regionStatuses: [
      { regionCode: "NA", status: "compliant", issues: [] },
      {
        regionCode: "EU",
        status: "review-needed",
        issues: [
          {
            id: "ing-issue-001",
            ruleId: "efsa-turmeric-001",
            ruleName: "EFSA Curcumin Intake Limit",
            source: "EFSA",
            severity: "critical",
            status: "review-needed",
            region: "EU",
            description: "Curcumin content may exceed EFSA recommended daily intake limits when used at standard concentrations",
            affectedItem: "Turmeric Extract",
            currentValue: "95% curcuminoids",
            allowedValue: "Usage-dependent",
            aiFix: "Recommend maximum usage rate of 2.5% in finished products for EU market",
            detectedAt: "2026-01-11T09:00:00Z",
          },
        ],
      },
      { regionCode: "UK", status: "review-needed", issues: [] },
    ],
    lastChecked: "2026-01-11T09:00:00Z",
  },
  "4": {
    ingredientId: "4",
    overallStatus: "compliant",
    regionStatuses: [
      { regionCode: "NA", status: "compliant", issues: [] },
      { regionCode: "EU", status: "compliant", issues: [] },
      { regionCode: "APAC", status: "compliant", issues: [] },
    ],
    lastChecked: "2026-01-13T08:15:00Z",
  },
  "6": {
    ingredientId: "6",
    overallStatus: "review-needed",
    regionStatuses: [
      {
        regionCode: "NA",
        status: "review-needed",
        issues: [
          {
            id: "ing-issue-002",
            ruleId: "fda-sodium-001",
            ruleName: "FDA Sodium Consideration",
            source: "FDA",
            severity: "info",
            status: "review-needed",
            region: "NA",
            description: "High sodium content - monitor usage in products making 'healthy' claims",
            affectedItem: "Himalayan Pink Salt",
            aiFix: "Recommend limiting to < 2% in formulations making health claims",
            detectedAt: "2026-01-08T12:00:00Z",
          },
        ],
      },
      { regionCode: "EU", status: "compliant", issues: [] },
    ],
    lastChecked: "2026-01-08T12:00:00Z",
  },
}

// Default guardrails settings
export const defaultGuardrails: RegulatoryGuardrails = {
  enabled: true,
  autoBlock: false,
  severityThreshold: "warning",
  enabledRuleSets: ["FDA", "EFSA", "FSANZ", "Health Canada"],
  notifyOnViolation: true,
}

// Default market selection
export const defaultMarketSelection: MarketSelection = {
  regions: ["NA"],
  countries: ["US"],
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getComplianceStatusColor(status: ComplianceStatus): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case "compliant":
      return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" }
    case "review-needed":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" }
    case "blocked":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" }
    case "pending":
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" }
  }
}

export function getSeverityColor(severity: RuleSeverity): { bg: string; text: string; border: string } {
  switch (severity) {
    case "critical":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
    case "warning":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
    case "info":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" }
  }
}

export function getComplianceLabel(status: ComplianceStatus): string {
  switch (status) {
    case "compliant":
      return "Compliant"
    case "review-needed":
      return "Review Needed"
    case "blocked":
      return "Blocked"
    case "pending":
      return "Pending Review"
    default:
      return "Unknown"
  }
}

export function getRegionByCode(code: string): Region | undefined {
  const clean = String(code || "").trim()
  const meta = COMPLIANCE_REGION_DISPLAY[clean]
  if (!meta) return undefined
  return { code: clean, name: meta.name, flag: meta.flag, countries: [] }
}

/** Country rows are sourced from API; this helper stays for compatibility. */
export function getCountryByCode(_code: string): Country | undefined {
  return undefined
}

// Get all compliance issues for notifications
export function getAllComplianceIssues(): ComplianceIssue[] {
  const issues: ComplianceIssue[] = []
  
  for (const [_, productStatus] of Object.entries(productComplianceData)) {
    issues.push(...productStatus.issues)
  }
  
  for (const [_, ingredientStatus] of Object.entries(ingredientComplianceData)) {
    for (const regionStatus of ingredientStatus.regionStatuses) {
      issues.push(...regionStatus.issues)
    }
  }
  
  return issues.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

// ─── Packaging dashboard (mock) ────────────────────────────────────────────────

/** Pagination page size for the packaging recommendations table mock. */
export const PACKAGING_ITEMS_PER_PAGE = 6

export const packagingPackagesData: PackageItem[] = [
  {
    id: "p1",
    name: "Rollstock for Form/Fill/Seal (pouching)",
    type: "Flexible Pouch",
    market: "Europe, North America",
    material: "Multi-layer LDPE",
    score: 72,
    costVariance: null,
    tag: "Retail",
    associatedProducts: ["prod-1", "prod-3"],
  },
  {
    id: "p2",
    name: "PRO-POUCH: Spouted",
    type: "Stand-Up Pouch",
    market: "Europe, North America",
    material: "PET/Foil/PE",
    score: 68,
    costVariance: "-$0.08",
    tag: "Retail",
    associatedProducts: ["prod-2"],
  },
  {
    id: "p3",
    name: "PRO-POUCH: Shaped",
    type: "Stand-Up Pouch",
    market: "Europe, North America",
    material: "OPP/PE",
    score: 74,
    costVariance: "+$0.12",
    tag: "Retail",
    associatedProducts: [],
  },
  {
    id: "p4",
    name: "PRO-POUCH: Side Gusset",
    type: "Side Gusset Bag",
    market: "Europe, North America",
    material: "Kraft/PE",
    score: 80,
    costVariance: null,
    tag: "Retail",
    associatedProducts: ["prod-4"],
  },
  {
    id: "p5",
    name: "PRO-POUCH: Inserted Gusset Stand Up Pouch",
    type: "Stand-Up Pouch",
    market: "Europe, North America",
    material: "BOPP/Metalized PET",
    score: 66,
    costVariance: "+$0.22",
    tag: "Retail",
    associatedProducts: [],
  },
  {
    id: "p6",
    name: "PRO-POUCH: Plow Bottom Stand Up Pouch",
    type: "Stand-Up Pouch",
    market: "Europe, North America",
    material: "Clear PET/PE",
    score: 71,
    costVariance: "-$0.05",
    tag: "Retail",
    associatedProducts: [],
  },
  {
    id: "p7",
    name: "Biodegradable Kraft Box",
    type: "Rigid Box",
    market: "North America",
    material: "FSC Certified Kraft",
    score: 92,
    costVariance: "+$0.35",
    tag: "Retail",
    associatedProducts: ["prod-5"],
  },
  {
    id: "p8",
    name: "Glass Jar 8oz",
    type: "Glass Container",
    market: "North America, APAC",
    material: "Borosilicate Glass",
    score: 88,
    costVariance: "+$0.55",
    tag: "Retail",
    associatedProducts: [],
  },
  {
    id: "p9",
    name: "Compostable Sleeve",
    type: "Sleeve Label",
    market: "Europe",
    material: "PLA-based Film",
    score: 95,
    costVariance: "+$0.18",
    tag: "Retail",
    associatedProducts: ["prod-2", "prod-3"],
  },
  {
    id: "p10",
    name: "Bulk Corrugated Shipper",
    type: "Corrugated Box",
    market: "North America",
    material: "Recycled Corrugated",
    score: 85,
    costVariance: "-$0.40",
    tag: "Food Service",
    associatedProducts: ["prod-4"],
  },
  {
    id: "p11",
    name: "Retort Pouch",
    type: "Retort Pouch",
    market: "Global",
    material: "Foil/Nylon/PP",
    score: 58,
    costVariance: null,
    tag: "Food Service",
    associatedProducts: [],
  },
  {
    id: "p12",
    name: "Mailer Box — DTC",
    type: "Mailer Box",
    market: "North America",
    material: "White Clay-Coated Board",
    score: 78,
    costVariance: "+$0.10",
    tag: "E-Commerce",
    associatedProducts: ["prod-1"],
  },
]

export const packagingProductsData: PackagingProduct[] = [
  { id: "prod-1", name: "Mango Turmeric Blend", sku: "SKU-1042", status: "Active", packagingId: "p1" },
  { id: "prod-2", name: "Buckwheat Protein Bar", sku: "SKU-2017", status: "Active", packagingId: "p2" },
  { id: "prod-3", name: "Spirulina Energy Shot", sku: "SKU-3301", status: "Concept", packagingId: null },
  { id: "prod-4", name: "Oat Fiber Powder", sku: "SKU-0889", status: "Active", packagingId: "p4" },
  { id: "prod-5", name: "Pea Protein Isolate Mix", sku: "SKU-5512", status: "Concept", packagingId: null },
]

export const packagingSustainabilityPointsData: SustainabilityPoint[] = [
  { month: "Sept", value: 10 },
  { month: "Oct", value: 22 },
  { month: "Nov", value: 30 },
  { month: "Dec", value: 42 },
  { month: "Jan", value: 55 },
  { month: "Feb", value: 52 },
]
