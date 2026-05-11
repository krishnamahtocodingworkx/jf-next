"use client";

import { IngredientAlert } from "@/components/ingredients/types";
import { AlertTriangle, ChevronRight, DollarSign, TrendingDown, Truck, X } from "lucide-react";

type Props = {
  alertFilter: "all" | "supply" | "price" | "score";
  dismissedAlerts: string[];
  onFilterChange: (value: "all" | "supply" | "price" | "score") => void;
  onDismiss: (id: string) => void;
};

const INGREDIENT_ALERTS: IngredientAlert[] = [
  {
    id: "alert-1",
    type: "supply",
    severity: "critical",
    category: "Supply Chain",
    ingredient: "Organic Blueberry Powder",
    description: "Supplier reports 3-week delay due to shipping constraints",
    timestamp: "2 hours ago",
  },
  {
    id: "alert-2",
    type: "price",
    severity: "warning",
    category: "Price Change",
    ingredient: "Madagascar Vanilla Extract",
    description: "Market price increased by 15% this month",
    timestamp: "5 hours ago",
  },
  {
    id: "alert-3",
    type: "score",
    severity: "warning",
    category: "Score Change",
    ingredient: "Palm Oil (RSPO)",
    description: "Sustainability score decreased after supplier audit",
    timestamp: "1 day ago",
  },
];

export default function IngredientAlertsPanel({
  alertFilter,
  dismissedAlerts,
  onFilterChange,
  onDismiss,
}: Props) {
  const visibleAlerts = INGREDIENT_ALERTS
    .filter((item) => !dismissedAlerts.includes(item.id))
    .filter((item) => alertFilter === "all" || item.type === alertFilter);

  const criticalCount = visibleAlerts.filter((item) => item.severity === "critical").length;
  const warningCount = visibleAlerts.filter((item) => item.severity === "warning").length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Ingredient Alerts
          </h3>
          <div className="flex items-center gap-1">
            {criticalCount > 0 && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {warningCount} warning
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {(["all", "supply", "price", "score"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onFilterChange(tab)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${alertFilter === tab ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 pb-1 space-y-1.5 max-h-[140px] overflow-y-auto">
        {visibleAlerts.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-[10px] text-slate-400">No active alerts</p>
          </div>
        ) : (
          visibleAlerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className={`relative rounded border p-2 ${alert.severity === "critical"
                ? "bg-red-50 border-red-200"
                : alert.severity === "warning"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-white border-slate-200"
                }`}
            >
              <button
                type="button"
                onClick={() => onDismiss(alert.id)}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-slate-100">
                  {alert.type === "supply" ? (
                    <Truck className="h-3 w-3 text-red-600" />
                  ) : alert.type === "price" ? (
                    <DollarSign className="h-3 w-3 text-amber-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-amber-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded bg-slate-800 text-white">
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.category}</span>
                  </div>
                  <h4 className="text-[11px] font-semibold text-slate-800 leading-tight">{alert.ingredient}</h4>
                  <p className="text-[10px] text-slate-600 leading-tight">{alert.description}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{alert.timestamp}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-3 py-2 border-t border-slate-100">
        <button type="button" className="text-[10px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
          View all alerts
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
