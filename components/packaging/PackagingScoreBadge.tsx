import type { PackagingScoreBadgeProps } from "@/utils/model";
import { getScoreBadgeClassName } from "@/utils/packaging-helpers";

export default function PackagingScoreBadge({ score, copy }: PackagingScoreBadgeProps) {
    if (score === null) return <span className="text-xs text-slate-400">{copy.emptyLabel}</span>;
    const color = getScoreBadgeClassName(score);
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
            {score}
        </span>
    );
}
