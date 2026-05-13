import { Supplier } from "@/interfaces/supplier"
import { useState } from "react"
import { agentActivities } from "./mockData"
import { Calendar, FileText, Mail, Star, Users, X } from "lucide-react"
import PipelineProgress from "./PipelineProgress"
import AgentStats from "./AgentStats"
import { ActivityItem } from "./ActivityItem"

export default function AgentActivityPanel({
    supplier,
    onClose,
    onSendEmail,
    onRequestQuote,
    onInviteToPlatform,
    onScheduleFollowUp,
}: {
    supplier: Supplier
    onClose: () => void
    onSendEmail: () => void
    onRequestQuote: () => void
    onInviteToPlatform: () => void
    onScheduleFollowUp: () => void
}) {
    const [activities, setActivities] = useState(
        agentActivities.map(a => ({ ...a, expanded: false }))
    )

    const toggleActivity = (id: string) => {
        setActivities(prev =>
            prev.map(a => a.id === id ? { ...a, expanded: !a.expanded } : a)
        )
    }

    const pipelinePercentage = supplier.pipelineStage === "connected" ? 100
        : supplier.pipelineStage === "platform-invite" ? 83
            : supplier.pipelineStage === "quote-requested" ? 66
                : supplier.pipelineStage === "email-sent" ? 50
                    : supplier.pipelineStage === "supplier-match" ? 33
                        : 16

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Star className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Agent Activity</h2>
                            <p className="text-sm text-slate-500">{supplier.name}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
                <PipelineProgress
                    currentStage={supplier.pipelineStage || "ingredient-need"}
                    percentage={pipelinePercentage}
                />

                <AgentStats stats={supplier.agentStats || { emails: 0, quotes: 0, pending: 0, invited: false }} />

                {/* Activity Feed */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Activity</h3>
                    <div className="divide-y divide-slate-100">
                        {activities.map(activity => (
                            <ActivityItem
                                key={activity.id}
                                activity={activity}
                                onToggle={() => toggleActivity(activity.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 border-t border-slate-200 bg-slate-50">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onSendEmail}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Send Email
                    </button>
                    <button
                        type="button"
                        onClick={onRequestQuote}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Request Quote
                    </button>
                    <button
                        type="button"
                        onClick={onInviteToPlatform}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        Invite to Platform
                    </button>
                    <button
                        type="button"
                        onClick={onScheduleFollowUp}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        Schedule Follow-up
                    </button>
                </div>
            </div>
        </div>
    )
}
