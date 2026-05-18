// Domain interfaces for the Compliance module — consumed by Overview, Product detail, and the regulatory components.
import type { ComplianceStatus, RegulatorySource, RuleSeverity } from "@/utils/model";

/** Top-level market region (NA / EU / APAC, etc.) with its member countries. */
export interface Region {
    code: string;
    name: string;
    flag: string;
    countries: Country[];
}

/** Single country with a back-pointer to its parent region. */
export interface Country {
    code: string;
    name: string;
    flag: string;
    regionCode: string;
}

/** Regulatory rule entry — describes the limit/restriction and the AI-suggested remediation. */
export interface RegulatoryRule {
    id: string;
    name: string;
    source: RegulatorySource;
    description: string;
    /** Region codes where this rule applies. */
    regions: string[];
    severity: RuleSeverity;
    category: "ingredient" | "labeling" | "claims" | "limits" | "allergen";
    nutrientLimits?: {
        nutrient: string;
        maxValue: number;
        unit: string;
    }[];
    ingredientRestrictions?: {
        ingredientId: string;
        ingredientName: string;
        maxPercentage?: number;
        banned?: boolean;
    }[];
    /** AI-suggested fix shown next to the issue. */
    aiFix?: string;
    documentUrl?: string;
}

/** Detected violation of a regulatory rule for a specific product/ingredient. */
export interface ComplianceIssue {
    id: string;
    ruleId: string;
    ruleName: string;
    source: RegulatorySource;
    severity: RuleSeverity;
    status: ComplianceStatus;
    region: string;
    description: string;
    /** Ingredient or product name surfaced by the issue. */
    affectedItem: string;
    currentValue?: string;
    allowedValue?: string;
    aiFix?: string;
    detectedAt: string;
}

/** Roll-up compliance status for a single product across selected markets. */
export interface ProductComplianceStatus {
    productId: string;
    overallStatus: ComplianceStatus;
    /** Active regions for this product. */
    regions: string[];
    issues: ComplianceIssue[];
    lastChecked: string;
}

/** Roll-up compliance status for a single ingredient across selected regions. */
export interface IngredientComplianceStatus {
    ingredientId: string;
    overallStatus: ComplianceStatus;
    regionStatuses: {
        regionCode: string;
        status: ComplianceStatus;
        issues: ComplianceIssue[];
    }[];
    lastChecked: string;
}

/** Per-tenant guardrail configuration applied before flagging violations. */
export interface RegulatoryGuardrails {
    enabled: boolean;
    /** Automatically block products that fail critical rules. */
    autoBlock: boolean;
    /** Minimum severity to flag. */
    severityThreshold: RuleSeverity;
    /** Which rule sets are active. */
    enabledRuleSets: string[];
    notifyOnViolation: boolean;
}

/** Selected target markets — regions implicitly include all member countries unless overridden. */
export interface MarketSelection {
    /** Selected region codes. */
    regions: string[];
    /** Selected country codes (overrides regional selection). */
    countries: string[];
}
