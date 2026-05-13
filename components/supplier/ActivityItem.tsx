import { AgentActivity } from "@/interfaces/supplier";
import { ChevronDown, ChevronUp, FileText, Mail, Target, Users } from "lucide-react";

export function ActivityItem({ activity, onToggle }: { activity: AgentActivity & { expanded?: boolean }; onToggle: () => void }) {
    const getTypeStyles = () => {
        switch (activity.type) {
            case "ingredient-need":
                return { bg: "bg-green-100", text: "text-green-700", label: "INGREDIENT NEED" }
            case "supplier-match":
                return { bg: "bg-blue-100", text: "text-blue-700", label: "SUPPLIER MATCH" }
            case "email-sent":
                return { bg: "bg-purple-100", text: "text-purple-700", label: "EMAIL SENT" }
            case "quote-response":
                return { bg: "bg-amber-100", text: "text-amber-700", label: "QUOTE RESPONSE" }
            default:
                return { bg: "bg-slate-100", text: "text-slate-700", label: "UPDATE" }
        }
    }

    const styles = getTypeStyles()

    return (
        <div className="border-b border-slate-100 last:border-0 py-4">
            <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${styles.bg} flex items-center justify-center shrink-0`}>
                    {activity.type === "ingredient-need" && <Target className={`w-4 h-4 ${styles.text}`} />}
                    {activity.type === "supplier-match" && <Users className={`w-4 h-4 ${styles.text}`} />}
                    {activity.type === "email-sent" && <Mail className={`w-4 h-4 ${styles.text}`} />}
                    {activity.type === "quote-response" && <FileText className={`w-4 h-4 ${styles.text}`} />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-semibold ${styles.text}`}>{styles.label}</span>
                        <span className="text-[10px] text-slate-400">{activity.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">{activity.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{activity.description}</p>
                    {activity.details && (
                        <button
                            type="button"
                            onClick={onToggle}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mt-2 transition-colors"
                        >
                            {activity.expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {activity.expanded ? "Hide details" : "View details"}
                        </button>
                    )}
                    {activity.expanded && activity.details && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 leading-relaxed">
                            {activity.details}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}