import type { DataSource } from "@/components/compliance/ComplianceComponents";
import type {
    ComplianceIssue,
    ProductComplianceStatus,
} from "@/interfaces/compliance";
import type {
    ComplianceStatus,
    RegulatorySource,
    RuleSeverity,
} from "@/utils/model";

const DATA_SOURCES: readonly DataSource[] = ["sap", "oracle", "netsuite", "excel", "csv", "manual", "api"];

/** Returns ERP/source badge only when the API sends a known `data_source` value. */
export function readProductDataSourceFromApi(raw: unknown): DataSource | null {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    const v = String(r.data_source ?? r.dataSource ?? r.source_system ?? r.sourceSystem ?? "")
        .toLowerCase()
        .trim();
    return (DATA_SOURCES as readonly string[]).includes(v) ? (v as DataSource) : null;
}

const REGULATORY_SOURCES: readonly RegulatorySource[] = [
    "FDA",
    "EFSA",
    "EU",
    "USDA",
    "FSANZ",
    "Health Canada",
    "UK FSA",
    "Codex",
];

function safeRegulatorySource(raw: unknown): RegulatorySource {
    const s = String(raw ?? "FDA").trim();
    return (REGULATORY_SOURCES as readonly string[]).includes(s) ? (s as RegulatorySource) : "FDA";
}

function safeSeverity(raw: unknown): RuleSeverity {
    const s = String(raw ?? "warning").toLowerCase();
    if (s === "critical" || s === "warning" || s === "info") return s;
    return "warning";
}

function normalizeComplianceStatus(raw: unknown): ComplianceStatus {
    const s = String(raw ?? "")
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");
    if (s === "compliant" || s === "pass" || s === "passed") return "compliant";
    if (s === "blocked" || s === "fail" || s === "failed") return "blocked";
    if (s === "review-needed" || s === "reviewneeded" || s === "warning") return "review-needed";
    return "pending";
}

function parseComplianceIssue(row: Record<string, unknown>, idx: number): ComplianceIssue | null {
    const id = String(row.id ?? row._id ?? `issue-${idx}`).trim();
    const description = String(row.description ?? row.message ?? row.detail ?? "").trim();
    const ruleName = String(row.ruleName ?? row.rule_name ?? row.rule ?? row.title ?? "").trim();
    if (!description && !ruleName) return null;
    return {
        id: id || `issue-${idx}`,
        ruleId: String(row.ruleId ?? row.rule_id ?? "unknown"),
        ruleName: ruleName || "Regulatory item",
        source: safeRegulatorySource(row.source ?? row.regulatory_source),
        severity: safeSeverity(row.severity),
        status: normalizeComplianceStatus(row.status),
        region: String(row.region ?? row.regionCode ?? row.region_code ?? "NA"),
        description: description || ruleName || "Compliance note",
        affectedItem: String(row.affectedItem ?? row.affected_item ?? row.item ?? ""),
        currentValue: row.currentValue != null ? String(row.currentValue) : undefined,
        allowedValue: row.allowedValue != null ? String(row.allowedValue) : undefined,
        aiFix: row.aiFix != null ? String(row.aiFix) : undefined,
        detectedAt: String(row.detectedAt ?? row.detected_at ?? new Date().toISOString()),
    };
}

/**
 * Build compliance UI state from product API payload only (no static mock catalog).
 * Extend the field list here when the backend documents compliance shapes.
 */
export function deriveProductComplianceFromApi(
    raw: unknown,
    productId: string,
): ProductComplianceStatus {
    const fallback = (): ProductComplianceStatus => ({
        productId,
        overallStatus: "pending",
        regions: ["NA"],
        issues: [],
        lastChecked: new Date().toISOString(),
    });

    if (!raw || typeof raw !== "object") return fallback();

    const r = raw as Record<string, unknown>;

    const regionsVal = r.compliance_regions ?? r.target_markets ?? r.complianceRegions ?? r.markets;
    let regions: string[] = ["NA"];
    if (Array.isArray(regionsVal) && regionsVal.length > 0) {
        const mapped = regionsVal
            .map((x) => {
                if (typeof x === "string") return x.trim();
                if (x && typeof x === "object" && "code" in (x as object)) {
                    return String((x as { code?: string }).code ?? "").trim();
                }
                return "";
            })
            .filter(Boolean);
        if (mapped.length) regions = mapped;
    }

    const issuesVal = r.compliance_issues ?? r.regulatory_issues ?? r.complianceIssues;
    let issues: ComplianceIssue[] = [];
    if (Array.isArray(issuesVal)) {
        issues = issuesVal
            .map((it, i) =>
                it && typeof it === "object"
                    ? parseComplianceIssue(it as Record<string, unknown>, i)
                    : null,
            )
            .filter((x): x is ComplianceIssue => x != null);
    }

    const overallRaw =
        r.compliance_overall_status ?? r.compliance_status ?? r.overall_compliance_status ?? "";
    const overallStatus = String(overallRaw).trim()
        ? normalizeComplianceStatus(overallRaw)
        : "pending";

    const lastChecked = String(
        r.compliance_last_checked ??
            r.complianceLastChecked ??
            r.updated_at ??
            r.updatedAt ??
            new Date().toISOString(),
    );
        console.log("[deriveProductComplianceFromApi]", productId, {
            overallStatus,
            regionCount: regions.length,
            issueCount: issues.length,
        });

    return {
        productId,
        overallStatus,
        regions,
        issues,
        lastChecked: lastChecked || new Date().toISOString(),
    };
}
