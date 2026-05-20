"use client";

import { TrendingUp } from "lucide-react";
import type { PackagingSustainabilityMiniChartProps } from "@/utils/model";
import {
    buildLineAndAreaPaths,
    buildSustainabilityChartPoints,
    gridLineY,
} from "@/utils/packaging-helpers";

const DEFAULT_MAX = 76.5;
const DEFAULT_HEIGHT = 80;
const DEFAULT_WIDTH = 280;
const DEFAULT_Y_GRID = [0, 26, 51, 76.5] as const;
const DEFAULT_Y_AXIS = [76.5, 51, 26, 0] as const;

export default function SustainabilityMiniChart({
    points,
    copy,
    chartMax = DEFAULT_MAX,
    chartHeight = DEFAULT_HEIGHT,
    chartWidth = DEFAULT_WIDTH,
    yGridValues = DEFAULT_Y_GRID,
    yAxisLabels = DEFAULT_Y_AXIS,
}: PackagingSustainabilityMiniChartProps) {
    const h = chartHeight;
    const w = chartWidth;
    const pts = buildSustainabilityChartPoints(points, chartMax, w, h);
    const { linePath, areaPath } = buildLineAndAreaPaths(pts, h);
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-bold text-slate-800">{copy.headlineScore}</span>
                <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">{copy.deltaLabel}</span>
                </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-3">{copy.improvementTitle}</p>
            <div className="relative" style={{ height: h }}>
                <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="sustGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>
                    {yGridValues.map((v) => {
                        const cy = gridLineY(v, chartMax, h);
                        return <line key={v} x1="0" y1={cy} x2={w} y2={cy} stroke="#e2e8f0" strokeWidth="1" />;
                    })}
                    <path d={areaPath} fill="url(#sustGrad)" />
                    <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" />
                    {pts.map((p) => (
                        <circle key={p.month} cx={p.x} cy={p.y} r="3" fill="#10b981" />
                    ))}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                    {points.map((p) => (
                        <span key={p.month} className="text-[10px] text-slate-400">{p.month}</span>
                    ))}
                </div>
                <div className="absolute top-0 right-full pr-1 flex flex-col justify-between h-full">
                    {yAxisLabels.map((v) => (
                        <span key={v} className="text-[10px] text-slate-400 leading-none">{v}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}


