// ─── Compliance Types ─────────────────────────────────────────────────────────

export type ComplianceStatus = "compliant" | "review-needed" | "blocked" | "pending"
export type RuleSeverity = "critical" | "warning" | "info"
export type RegulatorySource = "FDA" | "EFSA" | "EU" | "USDA" | "FSANZ" | "Health Canada" | "UK FSA" | "Codex"

export interface Region {
  code: string
  name: string
  flag: string
  countries: Country[]
}

export interface Country {
  code: string
  name: string
  flag: string
  regionCode: string
}

export interface RegulatoryRule {
  id: string
  name: string
  source: RegulatorySource
  description: string
  regions: string[] // Region codes where this rule applies
  severity: RuleSeverity
  category: "ingredient" | "labeling" | "claims" | "limits" | "allergen"
  nutrientLimits?: {
    nutrient: string
    maxValue: number
    unit: string
  }[]
  ingredientRestrictions?: {
    ingredientId: string
    ingredientName: string
    maxPercentage?: number
    banned?: boolean
  }[]
  aiFix?: string // AI-suggested fix for this rule
  documentUrl?: string
}

export interface ComplianceIssue {
  id: string
  ruleId: string
  ruleName: string
  source: RegulatorySource
  severity: RuleSeverity
  status: ComplianceStatus
  region: string
  description: string
  affectedItem: string // Ingredient name or product name
  currentValue?: string
  allowedValue?: string
  aiFix?: string
  detectedAt: string
}

export interface ProductComplianceStatus {
  productId: string
  overallStatus: ComplianceStatus
  regions: string[] // Active regions for this product
  issues: ComplianceIssue[]
  lastChecked: string
}

export interface IngredientComplianceStatus {
  ingredientId: string
  overallStatus: ComplianceStatus
  regionStatuses: {
    regionCode: string
    status: ComplianceStatus
    issues: ComplianceIssue[]
  }[]
  lastChecked: string
}

export interface RegulatoryGuardrails {
  enabled: boolean
  autoBlock: boolean // Automatically block products that fail critical rules
  severityThreshold: RuleSeverity // Minimum severity to flag
  enabledRuleSets: string[] // Which rule sets are active
  notifyOnViolation: boolean
}

export interface MarketSelection {
  regions: string[] // Selected region codes
  countries: string[] // Selected country codes (overrides regional selection)
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const regions: Region[] = [
  {
    code: "NA",
    name: "North America",
    flag: "🌎",
    countries: [
      { code: "US", name: "United States", flag: "🇺🇸", regionCode: "NA" },
      { code: "CA", name: "Canada", flag: "🇨🇦", regionCode: "NA" },
      { code: "MX", name: "Mexico", flag: "🇲🇽", regionCode: "NA" },
      { code: "GT", name: "Guatemala", flag: "🇬🇹", regionCode: "NA" },
      { code: "BZ", name: "Belize", flag: "🇧🇿", regionCode: "NA" },
      { code: "HN", name: "Honduras", flag: "🇭🇳", regionCode: "NA" },
      { code: "SV", name: "El Salvador", flag: "🇸🇻", regionCode: "NA" },
      { code: "NI", name: "Nicaragua", flag: "🇳🇮", regionCode: "NA" },
      { code: "CR", name: "Costa Rica", flag: "🇨🇷", regionCode: "NA" },
      { code: "PA", name: "Panama", flag: "🇵🇦", regionCode: "NA" },
      { code: "CU", name: "Cuba", flag: "🇨🇺", regionCode: "NA" },
      { code: "JM", name: "Jamaica", flag: "🇯🇲", regionCode: "NA" },
      { code: "HT", name: "Haiti", flag: "🇭🇹", regionCode: "NA" },
      { code: "DO", name: "Dominican Republic", flag: "🇩🇴", regionCode: "NA" },
      { code: "PR", name: "Puerto Rico", flag: "🇵🇷", regionCode: "NA" },
      { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹", regionCode: "NA" },
      { code: "BB", name: "Barbados", flag: "🇧🇧", regionCode: "NA" },
    ],
  },
  {
    code: "EU",
    name: "European Union",
    flag: "🇪🇺",
    countries: [
      { code: "DE", name: "Germany", flag: "🇩🇪", regionCode: "EU" },
      { code: "FR", name: "France", flag: "🇫🇷", regionCode: "EU" },
      { code: "IT", name: "Italy", flag: "🇮🇹", regionCode: "EU" },
      { code: "ES", name: "Spain", flag: "🇪🇸", regionCode: "EU" },
      { code: "NL", name: "Netherlands", flag: "🇳🇱", regionCode: "EU" },
      { code: "BE", name: "Belgium", flag: "🇧🇪", regionCode: "EU" },
      { code: "PL", name: "Poland", flag: "🇵🇱", regionCode: "EU" },
      { code: "SE", name: "Sweden", flag: "🇸🇪", regionCode: "EU" },
      { code: "AT", name: "Austria", flag: "🇦🇹", regionCode: "EU" },
      { code: "BG", name: "Bulgaria", flag: "🇧🇬", regionCode: "EU" },
      { code: "HR", name: "Croatia", flag: "🇭🇷", regionCode: "EU" },
      { code: "CY", name: "Cyprus", flag: "🇨🇾", regionCode: "EU" },
      { code: "CZ", name: "Czech Republic", flag: "🇨🇿", regionCode: "EU" },
      { code: "DK", name: "Denmark", flag: "🇩🇰", regionCode: "EU" },
      { code: "EE", name: "Estonia", flag: "🇪🇪", regionCode: "EU" },
      { code: "FI", name: "Finland", flag: "🇫🇮", regionCode: "EU" },
      { code: "GR", name: "Greece", flag: "🇬🇷", regionCode: "EU" },
      { code: "HU", name: "Hungary", flag: "🇭🇺", regionCode: "EU" },
      { code: "IE", name: "Ireland", flag: "🇮🇪", regionCode: "EU" },
      { code: "LV", name: "Latvia", flag: "🇱🇻", regionCode: "EU" },
      { code: "LT", name: "Lithuania", flag: "🇱🇹", regionCode: "EU" },
      { code: "LU", name: "Luxembourg", flag: "🇱🇺", regionCode: "EU" },
      { code: "MT", name: "Malta", flag: "🇲🇹", regionCode: "EU" },
      { code: "PT", name: "Portugal", flag: "🇵🇹", regionCode: "EU" },
      { code: "RO", name: "Romania", flag: "🇷🇴", regionCode: "EU" },
      { code: "SK", name: "Slovakia", flag: "🇸🇰", regionCode: "EU" },
      { code: "SI", name: "Slovenia", flag: "🇸🇮", regionCode: "EU" },
    ],
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    countries: [
      { code: "GB", name: "Great Britain", flag: "🇬🇧", regionCode: "UK" },
      { code: "IM", name: "Isle of Man", flag: "🇮🇲", regionCode: "UK" },
      { code: "GG", name: "Guernsey", flag: "🇬🇬", regionCode: "UK" },
      { code: "JE", name: "Jersey", flag: "🇯🇪", regionCode: "UK" },
    ],
  },
  {
    code: "EUROPE",
    name: "Rest of Europe",
    flag: "🌍",
    countries: [
      { code: "NO", name: "Norway", flag: "🇳🇴", regionCode: "EUROPE" },
      { code: "CH", name: "Switzerland", flag: "🇨🇭", regionCode: "EUROPE" },
      { code: "IS", name: "Iceland", flag: "🇮🇸", regionCode: "EUROPE" },
      { code: "LI", name: "Liechtenstein", flag: "🇱🇮", regionCode: "EUROPE" },
      { code: "AL", name: "Albania", flag: "🇦🇱", regionCode: "EUROPE" },
      { code: "AD", name: "Andorra", flag: "🇦🇩", regionCode: "EUROPE" },
      { code: "AM", name: "Armenia", flag: "🇦🇲", regionCode: "EUROPE" },
      { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", regionCode: "EUROPE" },
      { code: "BY", name: "Belarus", flag: "🇧🇾", regionCode: "EUROPE" },
      { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦", regionCode: "EUROPE" },
      { code: "GE", name: "Georgia", flag: "🇬🇪", regionCode: "EUROPE" },
      { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", regionCode: "EUROPE" },
      { code: "XK", name: "Kosovo", flag: "🇽🇰", regionCode: "EUROPE" },
      { code: "MK", name: "North Macedonia", flag: "🇲🇰", regionCode: "EUROPE" },
      { code: "MD", name: "Moldova", flag: "🇲🇩", regionCode: "EUROPE" },
      { code: "MC", name: "Monaco", flag: "🇲🇨", regionCode: "EUROPE" },
      { code: "ME", name: "Montenegro", flag: "🇲🇪", regionCode: "EUROPE" },
      { code: "RS", name: "Serbia", flag: "🇷🇸", regionCode: "EUROPE" },
      { code: "SM", name: "San Marino", flag: "🇸🇲", regionCode: "EUROPE" },
      { code: "TR", name: "Turkey", flag: "🇹🇷", regionCode: "EUROPE" },
      { code: "UA", name: "Ukraine", flag: "🇺🇦", regionCode: "EUROPE" },
      { code: "VA", name: "Vatican City", flag: "🇻🇦", regionCode: "EUROPE" },
      { code: "RU", name: "Russia", flag: "🇷🇺", regionCode: "EUROPE" },
    ],
  },
  {
    code: "APAC",
    name: "Asia Pacific",
    flag: "🌏",
    countries: [
      { code: "AU", name: "Australia", flag: "🇦🇺", regionCode: "APAC" },
      { code: "NZ", name: "New Zealand", flag: "🇳🇿", regionCode: "APAC" },
      { code: "JP", name: "Japan", flag: "🇯🇵", regionCode: "APAC" },
      { code: "KR", name: "South Korea", flag: "🇰🇷", regionCode: "APAC" },
      { code: "SG", name: "Singapore", flag: "🇸🇬", regionCode: "APAC" },
      { code: "CN", name: "China", flag: "🇨🇳", regionCode: "APAC" },
      { code: "HK", name: "Hong Kong", flag: "🇭🇰", regionCode: "APAC" },
      { code: "TW", name: "Taiwan", flag: "🇹🇼", regionCode: "APAC" },
      { code: "IN", name: "India", flag: "🇮🇳", regionCode: "APAC" },
      { code: "PK", name: "Pakistan", flag: "🇵🇰", regionCode: "APAC" },
      { code: "BD", name: "Bangladesh", flag: "🇧🇩", regionCode: "APAC" },
      { code: "LK", name: "Sri Lanka", flag: "🇱🇰", regionCode: "APAC" },
      { code: "NP", name: "Nepal", flag: "🇳🇵", regionCode: "APAC" },
      { code: "MM", name: "Myanmar", flag: "🇲🇲", regionCode: "APAC" },
      { code: "TH", name: "Thailand", flag: "🇹🇭", regionCode: "APAC" },
      { code: "VN", name: "Vietnam", flag: "🇻🇳", regionCode: "APAC" },
      { code: "PH", name: "Philippines", flag: "🇵🇭", regionCode: "APAC" },
      { code: "MY", name: "Malaysia", flag: "🇲🇾", regionCode: "APAC" },
      { code: "ID", name: "Indonesia", flag: "🇮🇩", regionCode: "APAC" },
      { code: "KH", name: "Cambodia", flag: "🇰🇭", regionCode: "APAC" },
      { code: "LA", name: "Laos", flag: "🇱🇦", regionCode: "APAC" },
      { code: "BN", name: "Brunei", flag: "🇧🇳", regionCode: "APAC" },
      { code: "TL", name: "Timor-Leste", flag: "🇹🇱", regionCode: "APAC" },
      { code: "MN", name: "Mongolia", flag: "🇲🇳", regionCode: "APAC" },
      { code: "FJ", name: "Fiji", flag: "🇫🇯", regionCode: "APAC" },
      { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", regionCode: "APAC" },
    ],
  },
  {
    code: "LATAM",
    name: "Latin America",
    flag: "🌎",
    countries: [
      { code: "BR", name: "Brazil", flag: "🇧🇷", regionCode: "LATAM" },
      { code: "AR", name: "Argentina", flag: "🇦🇷", regionCode: "LATAM" },
      { code: "CL", name: "Chile", flag: "🇨🇱", regionCode: "LATAM" },
      { code: "CO", name: "Colombia", flag: "🇨🇴", regionCode: "LATAM" },
      { code: "PE", name: "Peru", flag: "🇵🇪", regionCode: "LATAM" },
      { code: "VE", name: "Venezuela", flag: "🇻🇪", regionCode: "LATAM" },
      { code: "EC", name: "Ecuador", flag: "🇪🇨", regionCode: "LATAM" },
      { code: "BO", name: "Bolivia", flag: "🇧🇴", regionCode: "LATAM" },
      { code: "PY", name: "Paraguay", flag: "🇵🇾", regionCode: "LATAM" },
      { code: "UY", name: "Uruguay", flag: "🇺🇾", regionCode: "LATAM" },
      { code: "GY", name: "Guyana", flag: "🇬🇾", regionCode: "LATAM" },
      { code: "SR", name: "Suriname", flag: "🇸🇷", regionCode: "LATAM" },
    ],
  },
  {
    code: "MEA",
    name: "Middle East & Africa",
    flag: "🌍",
    countries: [
      { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", regionCode: "MEA" },
      { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", regionCode: "MEA" },
      { code: "IL", name: "Israel", flag: "🇮🇱", regionCode: "MEA" },
      { code: "EG", name: "Egypt", flag: "🇪🇬", regionCode: "MEA" },
      { code: "NG", name: "Nigeria", flag: "🇳🇬", regionCode: "MEA" },
      { code: "ZA", name: "South Africa", flag: "🇿🇦", regionCode: "MEA" },
      { code: "KE", name: "Kenya", flag: "🇰🇪", regionCode: "MEA" },
      { code: "ET", name: "Ethiopia", flag: "🇪🇹", regionCode: "MEA" },
      { code: "GH", name: "Ghana", flag: "🇬🇭", regionCode: "MEA" },
      { code: "TZ", name: "Tanzania", flag: "🇹🇿", regionCode: "MEA" },
      { code: "UG", name: "Uganda", flag: "🇺🇬", regionCode: "MEA" },
      { code: "DZ", name: "Algeria", flag: "🇩🇿", regionCode: "MEA" },
      { code: "MA", name: "Morocco", flag: "🇲🇦", regionCode: "MEA" },
      { code: "TN", name: "Tunisia", flag: "🇹🇳", regionCode: "MEA" },
      { code: "LY", name: "Libya", flag: "🇱🇾", regionCode: "MEA" },
      { code: "SD", name: "Sudan", flag: "🇸🇩", regionCode: "MEA" },
      { code: "QA", name: "Qatar", flag: "🇶🇦", regionCode: "MEA" },
      { code: "KW", name: "Kuwait", flag: "🇰🇼", regionCode: "MEA" },
      { code: "BH", name: "Bahrain", flag: "🇧🇭", regionCode: "MEA" },
      { code: "OM", name: "Oman", flag: "🇴🇲", regionCode: "MEA" },
      { code: "JO", name: "Jordan", flag: "🇯🇴", regionCode: "MEA" },
      { code: "LB", name: "Lebanon", flag: "🇱🇧", regionCode: "MEA" },
      { code: "IQ", name: "Iraq", flag: "🇮🇶", regionCode: "MEA" },
      { code: "IR", name: "Iran", flag: "🇮🇷", regionCode: "MEA" },
      { code: "SY", name: "Syria", flag: "🇸🇾", regionCode: "MEA" },
      { code: "YE", name: "Yemen", flag: "🇾🇪", regionCode: "MEA" },
      { code: "CI", name: "Cote d'Ivoire", flag: "🇨🇮", regionCode: "MEA" },
      { code: "CM", name: "Cameroon", flag: "🇨🇲", regionCode: "MEA" },
      { code: "SN", name: "Senegal", flag: "🇸🇳", regionCode: "MEA" },
      { code: "ZM", name: "Zambia", flag: "🇿🇲", regionCode: "MEA" },
      { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", regionCode: "MEA" },
      { code: "MZ", name: "Mozambique", flag: "🇲🇿", regionCode: "MEA" },
      { code: "AO", name: "Angola", flag: "🇦🇴", regionCode: "MEA" },
      { code: "RW", name: "Rwanda", flag: "🇷🇼", regionCode: "MEA" },
      { code: "MG", name: "Madagascar", flag: "🇲🇬", regionCode: "MEA" },
      { code: "MU", name: "Mauritius", flag: "🇲🇺", regionCode: "MEA" },
    ],
  },
  {
    code: "SA",
    name: "South Asia",
    flag: "🌏",
    countries: [
      { code: "AF", name: "Afghanistan", flag: "🇦🇫", regionCode: "SA" },
      { code: "MV", name: "Maldives", flag: "🇲🇻", regionCode: "SA" },
      { code: "BT", name: "Bhutan", flag: "🇧🇹", regionCode: "SA" },
    ],
  },
  {
    code: "CIS",
    name: "Central Asia",
    flag: "🌏",
    countries: [
      { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", regionCode: "CIS" },
      { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬", regionCode: "CIS" },
      { code: "TJ", name: "Tajikistan", flag: "🇹🇯", regionCode: "CIS" },
      { code: "TM", name: "Turkmenistan", flag: "🇹🇲", regionCode: "CIS" },
    ],
  },
]

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
  return regions.find(r => r.code === code)
}

export function getCountryByCode(code: string): Country | undefined {
  for (const region of regions) {
    const country = region.countries.find(c => c.code === code)
    if (country) return country
  }
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
