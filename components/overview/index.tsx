"use client"

import { useState, useRef, useEffect } from "react"
import {
    Lightbulb,
    Plus,
    BarChart3,
    Settings,
    FileText,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Heart,
    Filter,
    Sparkles,
    Shield,
} from "lucide-react"
import { DeveloperPortalModal, DeveloperPortalCard } from "./DeveloperPortalModal"
import { ComplianceStatusBar, RegulatorySummaryModal } from "./ComplianceComponents"
import { getAllComplianceIssues, productComplianceData } from "@/lib/compliance-data"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"

// ─── Data ─────────────────────────────────────────────────────────────────────

const whitepapers = [
    {
        id: "1",
        title: "The Future of Functional Ingredients",
        date: "Jan 2026",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=500&fit=crop&q=80",
        color: "from-teal-600 to-teal-800",
    },
    {
        id: "2",
        title: "Supply Chain Resilience in Food...",
        date: "Dec 2025",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=500&fit=crop&q=80",
        color: "from-amber-600 to-orange-700",
    },
    {
        id: "3",
        title: "AI-Driven Product Development",
        date: "Nov 2025",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=500&fit=crop&q=80",
        color: "from-violet-600 to-purple-800",
    },
    {
        id: "4",
        title: "Clean Label Trends 2026",
        date: "Oct 2025",
        image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=500&fit=crop&q=80",
        color: "from-emerald-600 to-green-700",
    },
    {
        id: "5",
        title: "Sustainable Sourcing Strategies",
        date: "Sep 2025",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=500&fit=crop&q=80",
        color: "from-slate-600 to-slate-800",
    },
]

const recentlyViewed = [
    { id: "1", name: "#1 Fine Dark Choc...", image: "/images/ingredients/dark-chocolate.jpg" },
    { id: "2", name: "Freeze Dried Blue...", image: "/images/ingredients/freeze-dried-blueberries.jpg" },
    { id: "3", name: "Blueberry Powder", image: "/images/ingredients/blueberry-powder.jpg" },
    { id: "4", name: "Filets De Salmon", image: "/images/ingredients/salmon-fillet.jpg" },
]

const topRecommendations = [
    {
        id: "1",
        name: "Organic Pea Protein Isolate",
        category: "Protein",
        score: 94,
        reason: "High protein content, matches your sustainability goals",
        image: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=200&h=200&fit=crop&q=80",
    },
    {
        id: "2",
        name: "Monk Fruit Extract",
        category: "Sweetener",
        score: 91,
        reason: "Zero calorie, clean label friendly",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop&q=80",
    },
    {
        id: "3",
        name: "Oat Beta-Glucan",
        category: "Fiber",
        score: 89,
        reason: "Heart health claims, trending ingredient",
        image: "https://images.unsplash.com/photo-1614961908856-4dbdbfb0de6c?w=200&h=200&fit=crop&q=80",
    },
]



export function OverviewTab() {
    const router = useRouter();
    const userName = useSelector((state: RootState) => state.user.details?.firstName);
    const [showDevPortal, setShowDevPortal] = useState(false)
    const [showComplianceModal, setShowComplianceModal] = useState(false)
    const [hasSeenComplianceModal, setHasSeenComplianceModal] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)
    const recentRef = useRef<HTMLDivElement>(null)

    // Calculate compliance stats from product data
    const productStatuses = Object.values(productComplianceData)
    const totalProducts = productStatuses.length
    const compliantCount = productStatuses.filter(p => p.overallStatus === "compliant").length
    const reviewNeededCount = productStatuses.filter(p => p.overallStatus === "review-needed").length
    const blockedCount = productStatuses.filter(p => p.overallStatus === "blocked").length
    const allIssues = getAllComplianceIssues()

    // Determine overall status
    const hasIssues = blockedCount > 0 || reviewNeededCount > 0
    const overallStatus = blockedCount > 0 ? "blocked" : reviewNeededCount > 0 ? "review-needed" : "compliant"

    // Show modal on first load if there are issues
    useEffect(() => {
        if (hasIssues && !hasSeenComplianceModal) {
            const timer = setTimeout(() => {
                setShowComplianceModal(true)
                setHasSeenComplianceModal(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [hasIssues, hasSeenComplianceModal])

    const scrollCarousel = (direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const scrollAmount = direction === "left" ? -300 : 300
            ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    return (
        <div className="max-w-7xl">
            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Welcome Back, {userName}</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your offerings and track their usage.</p>
            </div>

            {/* Regulatory Compliance Status Bar */}
            {hasIssues && (
                <div className="mb-6">
                    <ComplianceStatusBar
                        status={overallStatus}
                        issueCount={allIssues.length}
                        onClick={() => setShowComplianceModal(true)}
                    />
                </div>
            )}

            {/* Regulatory Compliance Card */}
            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => setShowComplianceModal(true)}
                    className={`w-full bg-white rounded-xl border p-5 text-left hover:shadow-md transition-all group ${hasIssues ? "border-amber-200" : "border-slate-200 hover:border-slate-300"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${hasIssues ? "bg-amber-100" : "bg-green-100"
                                }`}>
                                <Shield className={`h-6 w-6 ${hasIssues ? "text-amber-600" : "text-green-600"}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-1">Regulatory Compliance</h3>
                                <p className="text-sm text-slate-500">
                                    {hasIssues
                                        ? `${allIssues.length} issue${allIssues.length !== 1 ? "s" : ""} require attention across ${reviewNeededCount + blockedCount} product${reviewNeededCount + blockedCount !== 1 ? "s" : ""}`
                                        : "All products are compliant with applicable regulations"
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-3 text-center">
                                <div className="px-3 py-1 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-lg font-bold text-green-700">{compliantCount}</p>
                                    <p className="text-xs text-green-600">Compliant</p>
                                </div>
                                {reviewNeededCount > 0 && (
                                    <div className="px-3 py-1 bg-amber-50 rounded-lg border border-amber-200">
                                        <p className="text-lg font-bold text-amber-700">{reviewNeededCount}</p>
                                        <p className="text-xs text-amber-600">Review</p>
                                    </div>
                                )}
                                {blockedCount > 0 && (
                                    <div className="px-3 py-1 bg-red-50 rounded-lg border border-red-200">
                                        <p className="text-lg font-bold text-red-700">{blockedCount}</p>
                                        <p className="text-xs text-red-600">Blocked</p>
                                    </div>
                                )}
                            </div>
                            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </button>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Ingredient Tips */}
                <button
                    type="button"
                    onClick={() => router.push("ingredients")}
                    className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-slate-300 transition-all group"
                >
                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3 group-hover:bg-rose-100 transition-colors">
                        <Lightbulb className="h-5 w-5 text-rose-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">Ingredient Tips</h3>
                    <p className="text-sm text-slate-500 mb-3">Swap Protein Brownie recommended for you</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 group-hover:text-rose-700">
                        View Swap
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </button>

                {/* Add New Product */}
                <button
                    type="button"
                    onClick={() => router.push("products")}
                    className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-slate-300 transition-all group"
                >
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                        <Plus className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">Add New Product</h3>
                    <p className="text-sm text-slate-500 mb-3">Launch your next product with recommendations.</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        Add Product
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </button>

                {/* AI Insights Report */}
                <button
                    type="button"
                    onClick={() => router.push("analytics")}
                    className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-slate-300 transition-all group"
                >
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">AI Insights Report</h3>
                    <p className="text-sm text-slate-500 mb-3">Review analytics to stay on track</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        Create Report
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </button>
            </div>

            {/* Set Your Preferences */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Settings className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 mb-1">Set Your Preferences</h3>
                        <p className="text-sm text-slate-500 mb-3">
                            Personalize your ingredient and product recommendations by setting dietary focus, allergens, certifications, and more.
                        </p>
                        <button
                            type="button"
                            onClick={() => router.push("account")}
                            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            Open Settings
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* New Whitepapers */}
            <div className="mb-8">
                <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">New Whitepapers</h3>
                        <p className="text-sm text-slate-500">Dive into the findings that can transform your approach and drive success in your field.</p>
                    </div>
                </div>

                <div className="relative">
                    {/* Left arrow */}
                    <button
                        type="button"
                        onClick={() => scrollCarousel("left", carouselRef)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors -ml-4"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>

                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {whitepapers.map((paper) => (
                            <article
                                key={paper.id}
                                className="shrink-0 w-[160px] cursor-pointer group"
                            >
                                <div className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br ${paper.color} mb-2`}>
                                    <img
                                        src={paper.image}
                                        alt={paper.title}
                                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 p-3 flex flex-col justify-end">
                                        <h4 className="text-xs font-semibold text-white leading-snug drop-shadow-sm">{paper.title}</h4>
                                    </div>
                                </div>
                                <h4 className="text-sm font-medium text-slate-800 leading-snug mb-0.5 line-clamp-2">{paper.title}</h4>
                                <p className="text-xs text-slate-400">{paper.date}</p>
                            </article>
                        ))}
                    </div>

                    {/* Right arrow */}
                    <button
                        type="button"
                        onClick={() => scrollCarousel("right", carouselRef)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors -mr-4"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-5 w-5 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Top Recommendations */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold text-slate-800">Top Recommendation for You</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Latest Activity</span>
                        <button
                            type="button"
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                            aria-label="Filter"
                        >
                            <Filter className="h-4 w-4 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="text-sm font-medium text-slate-600 mb-4">Recently Viewed</h4>

                    <div className="relative">
                        {/* Left arrow */}
                        <button
                            type="button"
                            onClick={() => scrollCarousel("left", recentRef)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 transition-colors -ml-3"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                        </button>

                        <div
                            ref={recentRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {recentlyViewed.map((item) => (
                                <div
                                    key={item.id}
                                    className="shrink-0 w-[140px] cursor-pointer group"
                                >
                                    <div className="aspect-square rounded-xl bg-emerald-50 border border-emerald-100 overflow-hidden mb-2 group-hover:bg-emerald-100 transition-colors">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right arrow */}
                        <button
                            type="button"
                            onClick={() => scrollCarousel("right", recentRef)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 transition-colors -mr-3"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                        </button>
                    </div>

                    {/* Top Picks */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <h4 className="text-sm font-medium text-slate-600">AI-Powered Picks for You</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topRecommendations.map((rec) => (
                                <div
                                    key={rec.id}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                                        <img
                                            src={rec.image}
                                            alt={rec.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                                                {rec.score}% match
                                            </span>
                                        </div>
                                        <h5 className="text-sm font-semibold text-slate-800 truncate">{rec.name}</h5>
                                        <p className="text-xs text-slate-500 line-clamp-1">{rec.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Developer Portal Card */}
            <div className="mb-6">
                <DeveloperPortalCard onClick={() => setShowDevPortal(true)} />
            </div>

            {/* Developer Portal Modal */}
            <DeveloperPortalModal
                isOpen={showDevPortal}
                onClose={() => setShowDevPortal(false)}
            />

            {/* Regulatory Summary Modal */}
            <RegulatorySummaryModal
                isOpen={showComplianceModal}
                onClose={() => setShowComplianceModal(false)}
                totalProducts={totalProducts}
                compliantCount={compliantCount}
                reviewNeededCount={reviewNeededCount}
                blockedCount={blockedCount}
                topIssues={allIssues}
                onViewAllIssues={() => {
                    setShowComplianceModal(false)
                    router.push("notifications")
                }}
            />
        </div>
    )
}
