"use client";

import { Bell } from "lucide-react";

type Props = {
    activeCount: number;
    inactiveCount: number;
    total: number;
    averageMargin: number;
};

export default function ProductActionsCard({ activeCount, inactiveCount, total, averageMargin }: Props) {
    const activePercentage = total > 0 ? (activeCount / total) * 100 : 0;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Bell className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-700">Product Actions</h3>
            </div>
            <div className="space-y-2.5 flex-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Notifications Pending</span>
                    <span className="text-sm font-semibold text-slate-800">0</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Actions Pending</span>
                    <span className="text-sm font-semibold text-slate-800">0</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Inactive Products</span>
                    <span className="text-sm font-semibold text-blue-600">{inactiveCount}</span>
                </div>
            </div>
            <div className="mt-4">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${activePercentage}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                    {activeCount}/{total} active
                </p>
            </div>
        </div>
    );
}