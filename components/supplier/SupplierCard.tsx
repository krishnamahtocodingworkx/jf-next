import { Supplier, ViewMode } from "@/interfaces/supplier"
import { Box, ChevronRight, Clock, MapPin, MessageSquare, Phone, Sparkles } from "lucide-react"

export function SupplierCard({
    supplier,
    onConnect,
    onActivity,
    viewMode
}: {
    supplier: Supplier
    onConnect: (supplier: Supplier) => void
    onActivity: (supplier: Supplier) => void
    viewMode: ViewMode
}) {
    const formatWhatsAppLink = (phone: string) => {
        const cleaned = phone.replace(/[^0-9]/g, "")
        return `https://wa.me/${cleaned}`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Connected": return "bg-green-100 text-green-700"
            case "Active": return "bg-blue-100 text-blue-700"
            case "Inactive": return "bg-slate-100 text-slate-500"
            default: return "bg-amber-100 text-amber-700"
        }
    }

    if (viewMode === "list") {
        return (
            <div
                className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
                onClick={() => onConnect(supplier)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onConnect(supplier)}
                aria-label={`View ${supplier.name} supplier profile`}
            >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
                    <Box className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 truncate">{supplier.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                            {supplier.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {supplier.location}
                    </div>
                </div>
                <div className="text-sm text-slate-600">Score: {supplier.score}/100</div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        onClick={() => onActivity(supplier)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Activity
                    </button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
            </div>
        )
    }

    return (
        <div
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer"
            onClick={() => onConnect(supplier)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onConnect(supplier)}
            aria-label={`View ${supplier.name} supplier profile`}
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
                    <Box className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-800 leading-tight">{supplier.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${getStatusColor(supplier.status)}`}>
                            {supplier.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {supplier.location}
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-3">
                <div className="text-sm">
                    <span className="text-slate-600">Score: </span>
                    <span className="font-semibold text-slate-800">{supplier.score}/100</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    Last updated: {supplier.lastUpdated}
                </div>
            </div>

            <div className="mb-3">
                <p className="text-xs text-slate-500 mb-1.5">Ingredients:</p>
                {supplier.ingredients.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {supplier.ingredients.slice(0, 3).map((item, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                {item}
                            </span>
                        ))}
                        {supplier.ingredients.length > 3 && (
                            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                                +{supplier.ingredients.length - 3} more
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">N/A</span>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                {supplier.phone ? (
                    <a
                        href={formatWhatsAppLink(supplier.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors"
                    >
                        <Phone className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[100px]">{supplier.phone}</span>
                        <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                            <MessageSquare className="w-2.5 h-2.5" />
                        </span>
                    </a>
                ) : (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone className="h-3.5 w-3.5" />
                        N/A
                    </span>
                )}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onActivity(supplier)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Activity
                    </button>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        View Profile
                        <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </div>
    )
}