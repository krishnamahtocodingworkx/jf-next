"use client"

import { useState } from "react"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Sparkles,
  Globe,
  Shield,
  FileText,
  ExternalLink,
  X,
  Check,
  Info,
} from "lucide-react"
import {
  type ComplianceStatus,
  type RuleSeverity,
  type ComplianceIssue,
  type Region,
  type Country,
  type RegulatoryRule,
  getComplianceStatusColor,
  getSeverityColor,
  getComplianceLabel,
  regions,
} from "@/lib/compliance-data"

// ─── Compliance Badge ─────────────────────────────────────────────────────────

interface ComplianceBadgeProps {
  status: ComplianceStatus
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function ComplianceBadge({ status, size = "md", showLabel = true }: ComplianceBadgeProps) {
  const colors = getComplianceStatusColor(status)
  const label = getComplianceLabel(status)

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  const StatusIcon = {
    compliant: CheckCircle,
    "review-needed": AlertTriangle,
    blocked: XCircle,
    pending: Clock,
  }[status]

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}
    >
      <StatusIcon className={iconSize[size]} />
      {showLabel && label}
    </span>
  )
}

// ─── Severity Badge ───────────────────────────────────────────────────────────

interface SeverityBadgeProps {
  severity: RuleSeverity
  size?: "sm" | "md"
}

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  const colors = getSeverityColor(severity)
  const label = severity.charAt(0).toUpperCase() + severity.slice(1)

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      {label}
    </span>
  )
}

// ─── Data Source Badge ────────────────────────────────────────────────────────

export type DataSource = "sap" | "oracle" | "netsuite" | "excel" | "csv" | "manual" | "api"

interface DataSourceBadgeProps {
  source: DataSource
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

const dataSourceConfig: Record<DataSource, { label: string; bg: string; text: string; border: string; description: string }> = {
  sap: { label: "SAP", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", description: "Synced from SAP ERP" },
  oracle: { label: "Oracle", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", description: "Synced from Oracle ERP" },
  netsuite: { label: "NetSuite", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", description: "Synced from NetSuite" },
  excel: { label: "Excel", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", description: "Imported from Excel" },
  csv: { label: "CSV", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", description: "Imported from CSV" },
  manual: { label: "Manual", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", description: "Manually entered" },
  api: { label: "API", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", description: "Synced via API" },
}

export function DataSourceBadge({ source, size = "md", showLabel = true }: DataSourceBadgeProps) {
  const config = dataSourceConfig[source]
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
      title={config.description}
    >
      {(source === "sap" || source === "oracle" || source === "netsuite") ? (
        <svg className={iconSize[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ) : source === "excel" || source === "csv" ? (
        <svg className={iconSize[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/>
          <line x1="8" y1="17" x2="16" y2="17"/>
        </svg>
      ) : source === "api" ? (
        <svg className={iconSize[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      ) : (
        <svg className={iconSize[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      )}
      {showLabel && config.label}
    </span>
  )
}

// Helper to get full data source info
export function getDataSourceInfo(source: DataSource) {
  return dataSourceConfig[source]
}

// ─── Region Tag ───────────────────────────────────────────────────────────────

interface RegionTagProps {
  regionCode: string
  showFlag?: boolean
  size?: "sm" | "md"
}

export function RegionTag({ regionCode, showFlag = true, size = "md" }: RegionTagProps) {
  const region = regions.find((r) => r.code === regionCode)
  if (!region) return null

  return (
    <span
      className={`inline-flex items-center gap-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      {showFlag && <span>{region.flag}</span>}
      {region.code}
    </span>
  )
}

// ─── Compliance Issue Card ────────────────────────────────────────────────────

interface ComplianceIssueCardProps {
  issue: ComplianceIssue
  showAiFix?: boolean
  onViewRule?: (ruleId: string) => void
}

export function ComplianceIssueCard({ issue, showAiFix = true, onViewRule }: ComplianceIssueCardProps) {
  const [showFix, setShowFix] = useState(false)
  const severityColors = getSeverityColor(issue.severity)
  const statusColors = getComplianceStatusColor(issue.status)

  return (
    <div className={`p-4 rounded-xl border ${severityColors.border} ${severityColors.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={issue.severity} size="sm" />
            <span className="text-xs text-slate-500">{issue.source}</span>
            <RegionTag regionCode={issue.region} size="sm" />
          </div>
          <h4 className="font-medium text-slate-800 mt-2">{issue.ruleName}</h4>
          <p className="text-sm text-slate-600 mt-1">{issue.description}</p>

          {(issue.currentValue || issue.allowedValue) && (
            <div className="flex items-center gap-4 mt-3 text-sm">
              {issue.currentValue && (
                <div>
                  <span className="text-slate-500">Current: </span>
                  <span className="font-medium text-red-600">{issue.currentValue}</span>
                </div>
              )}
              {issue.allowedValue && (
                <div>
                  <span className="text-slate-500">Allowed: </span>
                  <span className="font-medium text-green-600">{issue.allowedValue}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <span>Affected: {issue.affectedItem}</span>
            <span>|</span>
            <span>Detected: {new Date(issue.detectedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <ComplianceBadge status={issue.status} size="sm" />
      </div>

      {showAiFix && issue.aiFix && (
        <div className="mt-3 pt-3 border-t border-slate-200/50">
          <button
            type="button"
            onClick={() => setShowFix(!showFix)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            AI Suggested Fix
            {showFix ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showFix && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              {issue.aiFix}
            </div>
          )}
        </div>
      )}

      {onViewRule && (
        <button
          type="button"
          onClick={() => onViewRule(issue.ruleId)}
          className="mt-3 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          <FileText className="h-4 w-4" />
          View full rule
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ─── Compliance Accordion ─────────────────────────────────────────────────────

interface ComplianceAccordionProps {
  title: string
  status: ComplianceStatus
  issues: ComplianceIssue[]
  defaultExpanded?: boolean
}

export function ComplianceAccordion({
  title,
  status,
  issues,
  defaultExpanded = false,
}: ComplianceAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const statusColors = getComplianceStatusColor(status)

  return (
    <div className={`rounded-xl border ${statusColors.border} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 ${statusColors.bg} hover:brightness-95 transition-all`}
      >
        <div className="flex items-center gap-3">
          <Shield className={`h-5 w-5 ${statusColors.text}`} />
          <span className="font-medium text-slate-800">{title}</span>
          <ComplianceBadge status={status} size="sm" />
          {issues.length > 0 && (
            <span className="text-xs text-slate-500">({issues.length} issue{issues.length !== 1 ? "s" : ""})</span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="p-4 bg-white space-y-3">
          {issues.length > 0 ? (
            issues.map((issue) => <ComplianceIssueCard key={issue.id} issue={issue} />)
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              No compliance issues detected
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Regulatory Rule Card ─────────────────────────────────────────────────────

interface RegulatoryRuleCardProps {
  rule: RegulatoryRule
  isActive?: boolean
  onToggle?: (ruleId: string, active: boolean) => void
}

export function RegulatoryRuleCard({ rule, isActive = true, onToggle }: RegulatoryRuleCardProps) {
  const severityColors = getSeverityColor(rule.severity)

  return (
    <div className={`p-4 rounded-xl border ${severityColors.border} ${isActive ? severityColors.bg : "bg-slate-50 opacity-60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-500">{rule.source}</span>
            <SeverityBadge severity={rule.severity} size="sm" />
            <div className="flex gap-1">
              {rule.regions.map((r) => (
                <RegionTag key={r} regionCode={r} size="sm" />
              ))}
            </div>
          </div>
          <h4 className="font-medium text-slate-800 mt-2">{rule.name}</h4>
          <p className="text-sm text-slate-600 mt-1">{rule.description}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
            {rule.category}
          </span>
        </div>
        {onToggle && (
          <button
            type="button"
            onClick={() => onToggle(rule.id, !isActive)}
            className={`shrink-0 w-10 h-6 rounded-full transition-colors ${
              isActive ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`block w-4 h-4 mx-1 bg-white rounded-full shadow transition-transform ${
                isActive ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Markets Selector ─────────────────────────────────────────────────────────

interface MarketsSelectorProps {
  selectedRegions: string[]
  selectedCountries: string[]
  onRegionToggle: (regionCode: string) => void
  onCountryToggle: (countryCode: string) => void
  onSelectAll?: () => void
  onClearAll?: () => void
}

export function MarketsSelector({
  selectedRegions,
  selectedCountries,
  onRegionToggle,
  onCountryToggle,
  onSelectAll,
  onClearAll,
}: MarketsSelectorProps) {
  const [expandedRegions, setExpandedRegions] = useState<string[]>([])

  const toggleRegionExpand = (regionCode: string) => {
    setExpandedRegions((prev) =>
      prev.includes(regionCode)
        ? prev.filter((r) => r !== regionCode)
        : [...prev, regionCode]
    )
  }

  const isRegionSelected = (region: Region) => {
    return selectedRegions.includes(region.code)
  }

  const isCountrySelected = (country: Country) => {
    return selectedCountries.includes(country.code)
  }

  const getRegionSelectionState = (region: Region): "all" | "some" | "none" => {
    if (selectedRegions.includes(region.code)) return "all"
    const selectedCountryCount = region.countries.filter((c) =>
      selectedCountries.includes(c.code)
    ).length
    if (selectedCountryCount === region.countries.length) return "all"
    if (selectedCountryCount > 0) return "some"
    return "none"
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-400" />
          Target Markets
        </h3>
        <div className="flex gap-2">
          {onSelectAll && (
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Select All
            </button>
          )}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Region list */}
      <div className="space-y-2">
        {regions.map((region) => {
          const selectionState = getRegionSelectionState(region)
          const isExpanded = expandedRegions.includes(region.code)

          return (
            <div key={region.code} className="rounded-xl border border-slate-200 overflow-hidden">
              {/* Region header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleRegionExpand(region.code)}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onRegionToggle(region.code)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectionState === "all"
                      ? "bg-blue-500 border-blue-500 text-white"
                      : selectionState === "some"
                      ? "bg-blue-200 border-blue-500"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {selectionState === "all" && <Check className="h-3 w-3" />}
                  {selectionState === "some" && <span className="w-2 h-0.5 bg-blue-500 rounded" />}
                </button>
                <span className="text-lg">{region.flag}</span>
                <span className="font-medium text-slate-800">{region.name}</span>
                <span className="text-xs text-slate-500">
                  ({region.countries.length} countries)
                </span>
              </div>

              {/* Country list */}
              {isExpanded && (
                <div className="px-4 py-2 bg-white grid grid-cols-2 md:grid-cols-3 gap-2">
                  {region.countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => onCountryToggle(country.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isCountrySelected(country)
                          ? "bg-blue-50 border border-blue-200 text-blue-700"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                          isCountrySelected(country)
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {isCountrySelected(country) && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Compliance Summary Row ───────────────────────────────────────────────────

interface ComplianceSummaryRowProps {
  status: ComplianceStatus
  regions: string[]
  issueCount: number
  onViewDetails?: () => void
}

export function ComplianceSummaryRow({
  status,
  regions,
  issueCount,
  onViewDetails,
}: ComplianceSummaryRowProps) {
  const statusColors = getComplianceStatusColor(status)

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${statusColors.border} ${statusColors.bg}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className={`h-5 w-5 ${statusColors.text}`} />
          <span className="font-medium text-slate-800">Regulatory Compliance</span>
        </div>
        <ComplianceBadge status={status} />
        <div className="flex gap-1">
          {regions.slice(0, 3).map((r) => (
            <RegionTag key={r} regionCode={r} size="sm" />
          ))}
          {regions.length > 3 && (
            <span className="text-xs text-slate-500">+{regions.length - 3} more</span>
          )}
        </div>
        {issueCount > 0 && (
          <span className="text-sm text-slate-600">
            {issueCount} issue{issueCount !== 1 ? "s" : ""} found
          </span>
        )}
      </div>
      {onViewDetails && (
        <button
          type="button"
          onClick={onViewDetails}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ─── Regulatory Summary Modal ─────────────────────────────────────────────────

interface RegulatorySummaryModalProps {
  isOpen: boolean
  onClose: () => void
  totalProducts: number
  compliantCount: number
  reviewNeededCount: number
  blockedCount: number
  topIssues: ComplianceIssue[]
  onViewAllIssues?: () => void
}

export function RegulatorySummaryModal({
  isOpen,
  onClose,
  totalProducts,
  compliantCount,
  reviewNeededCount,
  blockedCount,
  topIssues,
  onViewAllIssues,
}: RegulatorySummaryModalProps) {
  if (!isOpen) return null

  const compliancePercentage = totalProducts > 0
    ? Math.round((compliantCount / totalProducts) * 100)
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Regulatory Compliance Summary</h2>
              <p className="text-sm text-slate-500">Overview of your product compliance status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-3xl font-bold text-slate-800">{totalProducts}</p>
              <p className="text-sm text-slate-500 mt-1">Total Products</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-3xl font-bold text-green-600">{compliantCount}</p>
              <p className="text-sm text-green-600 mt-1">Compliant</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-3xl font-bold text-amber-600">{reviewNeededCount}</p>
              <p className="text-sm text-amber-600 mt-1">Review Needed</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-3xl font-bold text-red-600">{blockedCount}</p>
              <p className="text-sm text-red-600 mt-1">Blocked</p>
            </div>
          </div>

          {/* Compliance Rate */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Compliance Rate</span>
              <span className="text-lg font-bold text-slate-800">{compliancePercentage}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${compliancePercentage}%` }}
              />
            </div>
          </div>

          {/* Top Issues */}
          {topIssues.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Priority Issues</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {topIssues.slice(0, 3).map((issue) => (
                  <div
                    key={issue.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      getSeverityColor(issue.severity).border
                    } ${getSeverityColor(issue.severity).bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <SeverityBadge severity={issue.severity} size="sm" />
                      <span className="text-sm text-slate-700">{issue.ruleName}</span>
                    </div>
                    <RegionTag regionCode={issue.region} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
          {onViewAllIssues && topIssues.length > 0 && (
            <button
              type="button"
              onClick={onViewAllIssues}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Issues
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Compliance Status Bar ────────────────────────────────────────────────────

interface ComplianceStatusBarProps {
  status: ComplianceStatus
  issueCount: number
  onClick?: () => void
}

export function ComplianceStatusBar({ status, issueCount, onClick }: ComplianceStatusBarProps) {
  const statusColors = getComplianceStatusColor(status)

  if (status === "compliant" && issueCount === 0) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border ${statusColors.border} ${statusColors.bg} hover:brightness-95 transition-all`}
    >
      <div className="flex items-center gap-2">
        <Shield className={`h-4 w-4 ${statusColors.text}`} />
        <span className={`text-sm font-medium ${statusColors.text}`}>
          {issueCount} regulatory issue{issueCount !== 1 ? "s" : ""} require{issueCount === 1 ? "s" : ""} attention
        </span>
      </div>
      <ChevronRight className={`h-4 w-4 ${statusColors.text}`} />
    </button>
  )
}

// ─── Guardrails Toggle ────────────────────────────────────────────────────────

interface GuardrailsToggleProps {
  label: string
  description?: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function GuardrailsToggle({ label, description, enabled, onToggle }: GuardrailsToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white">
      <div className="flex-1">
        <p className="font-medium text-slate-800">{label}</p>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className={`shrink-0 w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-green-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`block w-5 h-5 mx-0.5 bg-white rounded-full shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

// ─── Severity Threshold Selector ──────────────────────────────────────────────

interface SeverityThresholdSelectorProps {
  value: RuleSeverity
  onChange: (value: RuleSeverity) => void
}

export function SeverityThresholdSelector({ value, onChange }: SeverityThresholdSelectorProps) {
  const options: { value: RuleSeverity; label: string; description: string }[] = [
    { value: "critical", label: "Critical Only", description: "Only flag critical compliance violations" },
    { value: "warning", label: "Warning & Above", description: "Flag warnings and critical issues" },
    { value: "info", label: "All Issues", description: "Flag all compliance considerations" },
  ]

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">Severity Threshold</label>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
              value === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                value === option.value ? "border-blue-500" : "border-slate-300"
              }`}
            >
              {value === option.value && <span className="w-2 h-2 rounded-full bg-blue-500" />}
            </span>
            <div className="flex-1">
              <p className={`font-medium ${value === option.value ? "text-blue-700" : "text-slate-700"}`}>
                {option.label}
              </p>
              <p className="text-xs text-slate-500">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
