"use client";

import { Supplier, ViewMode } from "@/interfaces/supplier";
import { useState } from "react";
import { suppliersData } from "./mockData";
import SupplierDashboard from "./SupplierDashboard";
import SupplierFullPageView from "./SupplierFullPageView";
import { Filter, LayoutGrid, List, Search, Sparkles } from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import AgentActivityPanel from "./AgentActivityPanel";
import SupplierDetailModal from "@/app/(app)/suppliers/[id]/page";
import EmailOutreachModal from "./EmailOutreachModal";
import { useRouter } from "next/navigation";

interface SuppliersPageProps {
    isSupplierMode?: boolean
}
export default function SuppliersClientPage({ isSupplierMode = false }: SuppliersPageProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [detailViewSupplier, setDetailViewSupplier] = useState<Supplier | null>(null)
    const [activitySupplier, setActivitySupplier] = useState<Supplier | null>(null)
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const handleConnect = (supplier: Supplier) => {
        router.push(`/suppliers/${supplier.id}`)
        // Open full page view when clicking Connect
        // setDetailViewSupplier(supplier)
    }

    const handleActivity = (supplier: Supplier) => {
        setActivitySupplier(supplier)
    }

    const handleSendEmail = (supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setShowEmailModal(true)
    }

    const handleEmailSent = () => {
        setShowEmailModal(false)
        setSelectedSupplier(null)
    }

    const filteredSuppliers = suppliersData.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Supplier Mode View
    if (isSupplierMode) {
        return <SupplierDashboard />
    }


    // Manufacturer Mode View
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Supplier Network</h1>
                    <p className="text-sm text-slate-500 mt-1">Discover, connect, and manage supplier relationships with AI-powered matching.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search suppliers or ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-64 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5">
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                            aria-label="Grid view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                            aria-label="List view"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Agent Summary Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">AI Agent Activity Summary</h3>
                        <p className="text-sm text-slate-600 mb-3">
                            Your agent has identified <strong>3 ingredient needs</strong> from your product pipeline, matched <strong>5 potential suppliers</strong>,
                            and sent <strong>2 outreach emails</strong> this week.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs text-slate-600">2 emails opened</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs text-slate-600">1 quote pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs text-slate-600">3 suppliers invited</span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                    >
                        View All Activity
                    </button>
                </div>
            </div>

            {/* Supplier Grid/List */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSuppliers.map((supplier) => (
                        <SupplierCard
                            key={supplier.id}
                            supplier={supplier}
                            onConnect={handleConnect}
                            onActivity={handleActivity}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredSuppliers.map((supplier) => (
                        <SupplierCard
                            key={supplier.id}
                            supplier={supplier}
                            onConnect={handleConnect}
                            onActivity={handleActivity}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}

            {/* Modals & Panels */}
            {activitySupplier && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setActivitySupplier(null)}
                    />
                    <AgentActivityPanel
                        supplier={activitySupplier}
                        onClose={() => setActivitySupplier(null)}
                        onSendEmail={() => {
                            setSelectedSupplier(activitySupplier)
                            setShowEmailModal(true)
                            setActivitySupplier(null)
                        }}
                        onRequestQuote={() => {
                            // Handle quote request
                            setActivitySupplier(null)
                        }}
                        onInviteToPlatform={() => {
                            // Handle platform invite
                            setActivitySupplier(null)
                        }}
                        onScheduleFollowUp={() => {
                            // Handle schedule follow-up
                            setActivitySupplier(null)
                        }}
                    />
                </>
            )}

            {selectedSupplier && !showEmailModal && (
                <SupplierDetailModal />
            )}

            {showEmailModal && selectedSupplier && (
                <EmailOutreachModal
                    supplier={selectedSupplier}
                    onClose={() => {
                        setShowEmailModal(false)
                        setSelectedSupplier(null)
                    }}
                    onSend={handleEmailSent}
                />
            )}
        </div>
    )
}