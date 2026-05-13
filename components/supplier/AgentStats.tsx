import { CheckCircle2, Clock } from "lucide-react";

export default function AgentStats({ stats }: { stats: { emails: number; quotes: number; pending: number; invited: boolean } }) {
    return (
        <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-slate-800">{stats.emails}</div>
                <div className="text-[10px] text-slate-500">Emails</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-slate-800">{stats.quotes}</div>
                <div className="text-[10px] text-slate-500">Quotes</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className={`text-xl font-bold ${stats.pending > 0 ? "text-red-500" : "text-slate-800"}`}>{stats.pending}</div>
                <div className="text-[10px] text-slate-500">Pending</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className={`flex items-center justify-center ${stats.invited ? "text-green-500" : "text-slate-300"}`}>
                    {stats.invited ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <Clock className="w-5 h-5" />
                    )}
                </div>
                <div className="text-[10px] text-slate-500">Invited</div>
            </div>
        </div>
    )
}