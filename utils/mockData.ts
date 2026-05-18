// Mock compliance data used by the Overview + Product detail pages.
// All types live in `@/utils/model` and interfaces in `@/interfaces/compliance`; this file owns data + lookups only.
import { COMPLIANCE_REGION_DISPLAY } from "@/utils/enum";
import type { ComplianceStatus, RuleSeverity } from "@/utils/model";
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
