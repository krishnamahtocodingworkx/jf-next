"use client";
import { suppliersData } from "@/components/supplier/mockData"
import { Supplier } from "@/interfaces/supplier"
import { Box, CheckCircle2, Globe, Mail, MapPin, Phone, Send, X } from "lucide-react"

export default function SupplierDetailModal() {
    const formatWhatsAppLink = (phone: string) => {
        const cleaned = phone.replace(/[^0-9]/g, "")
        return `https://wa.me/${cleaned}`
    }
    const supplier: Supplier = suppliersData[0]

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                <Box className="h-8 w-8 text-amber-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-slate-800">{supplier.name}</h2>
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">{supplier.status}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                                    <MapPin className="h-4 w-4" />
                                    {supplier.location}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => console.log("Close modal")}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-1">Quality Score</p>
                            <p className="text-2xl font-bold text-slate-800">{supplier.score}/100</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                            <p className="text-sm font-medium text-slate-800">{supplier.lastUpdated}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">About</h3>
                        <p className="text-sm text-slate-600">{supplier.description}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">Ingredients Supplied</h3>
                        {supplier.ingredients.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {supplier.ingredients.map((ing, i) => (
                                    <span key={i} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No ingredients listed</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">Certifications</h3>
                        {supplier.certifications.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {supplier.certifications.map((cert, i) => (
                                    <span key={i} className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full border border-green-200 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No certifications listed</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Mail className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-600">{supplier.email}</span>
                            </div>
                            {supplier.phone && (
                                <a
                                    href={formatWhatsAppLink(supplier.phone)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <Phone className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700">{supplier.phone}</span>
                                    <span className="ml-auto text-xs font-medium text-green-600">Open WhatsApp</span>
                                </a>
                            )}
                            {supplier.website && (
                                <a
                                    href={`https://${supplier.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <Globe className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm text-blue-600">{supplier.website}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 flex gap-3">
                    <button
                        type="button"
                        onClick={() => console.log("onSend Email on Supplier called ", supplier)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Send className="h-4 w-4" />
                        Send Outreach Email
                    </button>
                    <button
                        type="button"
                        onClick={() => console.log("onRequest Quote on Supplier called ", supplier)}
                        className="px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
