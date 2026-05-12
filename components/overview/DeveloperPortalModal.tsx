"use client"

import { useState } from "react"
import {
    X,
    Code2,
    Key,
    Copy,
    Check,
    ExternalLink,
    Terminal,
    Database,
    Webhook,
    FileJson,
    Shield,
    Zap,
    BookOpen,
    ArrowRight,
} from "lucide-react"

interface DeveloperPortalModalProps {
    isOpen: boolean
    onClose: () => void
}

const apiFeatures = [
    {
        icon: Database,
        title: "Ingredient Database API",
        description: "Access 100,000+ ingredients with nutritional profiles, sustainability scores, and sourcing data.",
    },
    {
        icon: FileJson,
        title: "Product Formulation API",
        description: "Retrieve and manage product recipes, ingredient lists, and formulation optimization data.",
    },
    {
        icon: Webhook,
        title: "Real-time Webhooks",
        description: "Get instant notifications for price changes, supply alerts, and sustainability updates.",
    },
    {
        icon: Shield,
        title: "Compliance & Labeling API",
        description: "Generate nutrition facts panels, allergen warnings, and regulatory compliance reports.",
    },
]

const codeExample = `// Example: Fetch ingredient data
const response = await fetch(
  'https://api.journeyfoods.io/v1/ingredients/search',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: 'organic blueberry',
      filters: {
        sustainability_score: { min: 80 },
        certifications: ['USDA Organic']
      }
    })
  }
);

const data = await response.json();
console.log(data.ingredients);`

export function DeveloperPortalModal({ isOpen, onClose }: DeveloperPortalModalProps) {
    const [copied, setCopied] = useState(false)
    const [copiedKey, setCopiedKey] = useState(false)

    const handleCopyCode = () => {
        navigator.clipboard.writeText(codeExample)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCopyKey = () => {
        navigator.clipboard.writeText("jf_live_xxxxxxxxxxxxxxxxxxxxxxxxxx")
        setCopiedKey(true)
        setTimeout(() => setCopiedKey(false), 2000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                onKeyDown={(e) => e.key === "Escape" && onClose()}
                role="button"
                tabIndex={0}
                aria-label="Close modal"
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Code2 className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Developer Portal</h2>
                            <p className="text-slate-400 mt-1">
                                Access the Journey Foods API to integrate our data into your systems
                            </p>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-8 mt-6">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-slate-300">99.9% Uptime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-slate-300">100K+ Ingredients</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-slate-300">RESTful + GraphQL</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* API Key Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Key className="h-4 w-4 text-slate-500" />
                            Your API Key
                        </h3>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <code className="text-sm font-mono text-slate-700 bg-slate-100 px-3 py-2 rounded-lg block truncate">
                                        jf_live_xxxxxxxxxxxxxxxxxxxxxxxxxx
                                    </code>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyKey}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors shrink-0"
                                >
                                    {copiedKey ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Copy Key
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">
                                Keep your API key secure. Do not share it publicly or commit it to version control.
                            </p>
                        </div>
                    </div>

                    {/* API Features */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
                            Available APIs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {apiFeatures.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={feature.title}
                                        className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                                                <Icon className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-800 mb-1">{feature.title}</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Code Example */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                                Quick Start Example
                            </h3>
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                        <span className="text-emerald-600">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy code
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                            <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                                {codeExample}
                            </pre>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                        <a
                            href="https://developers.journeyfoods.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open Developer Portal
                        </a>
                        <a
                            href="https://developers.journeyfoods.io/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <BookOpen className="h-4 w-4" />
                            Read Docs
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Compact card version for embedding in pages
export function DeveloperPortalCard({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full text-left bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 hover:shadow-lg transition-all group"
        >
            <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                    <Code2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white mb-1">Developer Portal</h3>
                    <p className="text-sm text-slate-400 leading-snug">
                        Access the Journey Foods API to integrate ingredient data into your systems.
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        Open Portal
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </button>
    )
}
