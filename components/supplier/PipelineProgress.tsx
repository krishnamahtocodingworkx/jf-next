import { CheckCircle2 } from "lucide-react";
import { pipelineStages } from "./mockData";
import { PipelineStage } from "@/interfaces/supplier";

export default function PipelineProgress({ currentStage, percentage }: { currentStage: PipelineStage; percentage: number }) {
    const currentIndex = pipelineStages.findIndex(s => s.key === currentStage)

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Pipeline Progress</span>
                <span className="text-sm font-semibold text-slate-800">{percentage}%</span>
            </div>
            <div className="flex items-center gap-1">
                {pipelineStages.map((stage, index) => {
                    const isCompleted = index <= currentIndex
                    const isCurrent = index === currentIndex

                    return (
                        <div key={stage.key} className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted
                                    ? "bg-green-500 border-green-500"
                                    : "bg-white border-slate-300"
                                    } ${isCurrent ? "ring-2 ring-green-200" : ""}`}
                            >
                                {isCompleted && (
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                )}
                            </div>
                            <span className={`text-[9px] text-center mt-1.5 leading-tight whitespace-pre-line ${isCompleted ? "text-slate-700 font-medium" : "text-slate-400"
                                }`}>
                                {stage.label}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="flex items-center mt-2">
                <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    )
}