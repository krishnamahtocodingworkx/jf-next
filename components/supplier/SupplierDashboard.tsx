import { ArrowRight, Building2, CheckCircle2, ChevronRight, Eye, RefreshCw, Sparkles, Target, TrendingUp, Upload } from "lucide-react";
import { inboundOpportunities } from "./mockData";
import { InboundOpportunity } from "@/interfaces/supplier";


function InboundOpportunityCard({ opportunity }: { opportunity: InboundOpportunity }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-100 text-blue-700"
            case "reviewing": return "bg-amber-100 text-amber-700"
            case "responded": return "bg-green-100 text-green-700"
            case "matched": return "bg-purple-100 text-purple-700"
            default: return "bg-slate-100 text-slate-700"
        }
    }

    return (
        <div className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800">{opportunity.brandName}</h4>
                        <p className="text-xs text-slate-500">{opportunity.receivedAt}</p>
                    </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(opportunity.status)}`}>
                    {opportunity.status}
                </span>
            </div>
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Ingredient:</span>
                    <span className="text-sm font-medium text-slate-800">{opportunity.ingredient}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Quantity:</span>
                    <span className="text-sm text-slate-700">{opportunity.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Timeline:</span>
                    <span className="text-sm text-slate-700">{opportunity.timeline}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Respond
                </button>
                <button
                    type="button"
                    className="px-3 py-2 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    )
}

export default function SupplierDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Supplier Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your profile, respond to opportunities, and grow your business.</p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    Update Catalog
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Inbound Leads</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-800">12</span>
                        <span className="text-sm text-green-600 font-medium">+3 this week</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Active Connections</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-800">8</span>
                        <span className="text-sm text-green-600 font-medium">+2 this month</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Eye className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Profile Views</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-800">156</span>
                        <span className="text-sm text-green-600 font-medium">+28% vs last month</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Quote Requests</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-800">5</span>
                        <span className="text-sm text-amber-600 font-medium">2 pending</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inbound Opportunities */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Inbound Opportunities</h2>
                        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inboundOpportunities.map(opp => (
                            <InboundOpportunityCard key={opp.id} opportunity={opp} />
                        ))}
                    </div>
                </div>

                {/* Profile & Agent Suggestions */}
                <div className="space-y-4">
                    {/* Profile Completion */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Profile Completion</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">60% Complete</span>
                                    <span className="text-amber-600 font-medium">4 items left</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <span className="text-sm text-slate-600">Add pricing info</span>
                                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">Add</button>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <span className="text-sm text-slate-600">Upload certifications</span>
                                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">Upload</button>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <span className="text-sm text-slate-600">Set lead times</span>
                                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">Set</button>
                            </div>
                        </div>
                    </div>

                    {/* Agent Suggestions */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800">Agent Suggestions</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-white/80 rounded-lg">
                                <p className="text-sm text-slate-700 mb-2">
                                    <strong>Update pricing</strong> for Organic Mango Puree - 3 brands are searching for this ingredient.
                                </p>
                                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    Update now <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="p-3 bg-white/80 rounded-lg">
                                <p className="text-sm text-slate-700 mb-2">
                                    <strong>Add certification</strong> - Brands filtering for Non-GMO can&apos;t find your Pea Protein.
                                </p>
                                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    Add certification <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Data Freshness */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-800">Data Freshness</h3>
                            <button type="button" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <RefreshCw className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Ingredient Catalog</span>
                                <span className="text-xs text-green-600 font-medium">Updated 2 days ago</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Pricing Data</span>
                                <span className="text-xs text-amber-600 font-medium">14 days old</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Certifications</span>
                                <span className="text-xs text-green-600 font-medium">Up to date</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Lead Times</span>
                                <span className="text-xs text-red-600 font-medium">30+ days old</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}