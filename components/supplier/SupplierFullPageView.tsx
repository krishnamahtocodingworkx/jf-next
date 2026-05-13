"use client";
import { Supplier } from "@/interfaces/supplier"
import { ArrowLeft, Award, BarChart3, Box, Calendar, CheckCircle2, Clock, Download, ExternalLink, FileText, Globe, Mail, MapPin, MessageSquare, Package, Phone, Send, Sparkles, Truck } from "lucide-react"
import { DataSourceBadge } from "../compliance/ComplianceComponents"
import { suppliersData } from "./mockData"
import { useRouter } from "next/navigation";



export default function SupplierFullPageView() {
    const router = useRouter();
    const supplier = suppliersData[0];

    const formatWhatsAppLink = (phone: string) => {
        const cleaned = phone.replace(/[^0-9]/g, "")
        return `https://wa.me/${cleaned}`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Connected": return "bg-green-100 text-green-700 border-green-200"
            case "Active": return "bg-blue-100 text-blue-700 border-blue-200"
            case "Inactive": return "bg-slate-100 text-slate-500 border-slate-200"
            default: return "bg-amber-100 text-amber-700 border-amber-200"
        }
    }

    const pipelinePercentage = supplier.pipelineStage === "connected" ? 100
        : supplier.pipelineStage === "platform-invite" ? 83
            : supplier.pipelineStage === "quote-requested" ? 66
                : supplier.pipelineStage === "email-sent" ? 50
                    : supplier.pipelineStage === "supplier-match" ? 33
                        : 16

    // Mock data for products supplied
    const productsSupplied = [
        { id: "1", name: "Organic Protein Bar", status: "active" },
        { id: "2", name: "Green Smoothie Mix", status: "active" },
        { id: "3", name: "Matcha Energy Bites", status: "concept" },
    ]

    // Mock order history
    const orderHistory = [
        { id: "1", date: "Mar 15, 2026", amount: "$12,500", status: "completed" },
        { id: "2", date: "Feb 28, 2026", amount: "$8,750", status: "completed" },
        { id: "3", date: "Jan 20, 2026", amount: "$15,200", status: "completed" },
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
                <div className="px-4 sm:px-6 py-4">
                    <button
                        type="button"
                        onClick={() => router.push("/suppliers")}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Suppliers
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center shrink-0">
                                <Box className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">{supplier.name}</h1>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${getStatusColor(supplier.status)}`}>
                                        {supplier.status}
                                    </span>
                                    {supplier.dataSource && <DataSourceBadge source={supplier.dataSource} size="sm" />}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                                    <span className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
                                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        {supplier.location}
                                    </span>
                                    <span className="hidden sm:block text-sm text-slate-400">|</span>
                                    <span className="text-xs sm:text-sm text-slate-500">Updated {supplier.lastUpdated}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <Download className="h-4 w-4 text-slate-500" />
                            </button>
                            <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <ExternalLink className="h-4 w-4 text-slate-500" />
                            </button>
                            <button
                                type="button"
                                onClick={() => console.log("Contact Supplier")}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                <span className="hidden sm:inline">Contact Supplier</span>
                                <span className="sm:hidden">Contact</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* About */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3">About</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">{supplier.description}</p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 text-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-blue-100 flex items-center justify-center mb-2 sm:mb-3">
                                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-slate-800">{supplier.score.toFixed(0)}</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Quality Score</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 text-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-green-100 flex items-center justify-center mb-2 sm:mb-3">
                                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-slate-800">{supplier.ingredients.length}</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Ingredients</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 text-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-amber-100 flex items-center justify-center mb-2 sm:mb-3">
                                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-slate-800">{supplier.agentStats?.quotes || 0}</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Orders</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 text-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-violet-100 flex items-center justify-center mb-2 sm:mb-3">
                                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-slate-800">{pipelinePercentage}%</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Pipeline</p>
                            </div>
                        </div>

                        {/* Ingredients Supplied */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Ingredients Supplied</h2>
                            {supplier.ingredients.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {supplier.ingredients.map((ing, i) => (
                                        <span key={i} className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No ingredients listed</p>
                            )}
                        </div>

                        {/* Products Using This Supplier */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Products Using This Supplier</h2>
                            <div className="space-y-2 sm:space-y-3">
                                {productsSupplied.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                                                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">{product.name}</span>
                                        </div>
                                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${product.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                            }`}>
                                            {product.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Order History</h2>
                            <div className="space-y-2 sm:space-y-3">
                                {orderHistory.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-slate-700">{order.date}</p>
                                                <p className="text-[10px] sm:text-xs text-slate-400">Order #{order.id}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs sm:text-sm font-semibold text-slate-800">{order.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    {/* Right Column - Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3 sm:mb-4">Contact Information</h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                                    <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                                    <span className="text-xs sm:text-sm text-slate-600 break-all">{supplier.email}</span>
                                </div>
                                {supplier.phone && (
                                    <a
                                        href={formatWhatsAppLink(supplier.phone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <Phone className="h-4 w-4 text-green-600 shrink-0" />
                                        <span className="text-xs sm:text-sm text-green-700">{supplier.phone}</span>
                                        <MessageSquare className="h-4 w-4 text-green-500 ml-auto shrink-0" />
                                    </a>
                                )}
                                {supplier.website && (
                                    <a
                                        href={`https://${supplier.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <Globe className="h-4 w-4 text-slate-500 shrink-0" />
                                        <span className="text-xs sm:text-sm text-blue-600 truncate">{supplier.website}</span>
                                        <ExternalLink className="h-3 w-3 text-slate-400 ml-auto shrink-0" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3 sm:mb-4">Certifications</h3>
                            {supplier.certifications.length > 0 ? (
                                <div className="space-y-2">
                                    {supplier.certifications.map((cert, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                            <span className="text-xs sm:text-sm text-green-700 font-medium">{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No certifications listed</p>
                            )}
                        </div>

                        {/* Agent Activity Summary */}
                        {supplier.agentStats && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 sm:p-6">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    <h3 className="text-sm font-semibold text-slate-800">AI Agent Activity</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 text-center">
                                        <p className="text-lg sm:text-xl font-bold text-slate-800">{supplier.agentStats.emails}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-500">Emails Sent</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 text-center">
                                        <p className="text-lg sm:text-xl font-bold text-slate-800">{supplier.agentStats.quotes}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-500">Quotes</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 text-center">
                                        <p className={`text-lg sm:text-xl font-bold ${supplier.agentStats.pending > 0 ? "text-amber-600" : "text-slate-800"}`}>
                                            {supplier.agentStats.pending}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-slate-500">Pending</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 text-center flex flex-col items-center justify-center">
                                        {supplier.agentStats.invited ? (
                                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                        ) : (
                                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                        )}
                                        <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                                            {supplier.agentStats.invited ? "Invited" : "Not Invited"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3 sm:mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => console.log("Send email called")}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Email
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <FileText className="h-4 w-4" />
                                    Request Quote
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Calendar className="h-4 w-4" />
                                    Schedule Call
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
