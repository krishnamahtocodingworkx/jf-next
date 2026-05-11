"use client";

type Props = {
  activeCount: number;
  flaggedCount: number;
  total: number;
};

export default function IngredientActionsCard({ activeCount, flaggedCount, total }: Props) {
  const percentage = total > 0 ? (activeCount / total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="text-xs font-semibold text-slate-700 mb-2">Ingredient Actions</h3>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Notifications Pending</span>
          <span className="font-semibold text-slate-800">3</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Actions Pending</span>
          <span className="font-semibold text-slate-800">0</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Flagged Ingredients</span>
          <span className="font-semibold text-red-600">{flaggedCount}</span>
        </div>
      </div>
      <div className="mt-2 h-1 bg-slate-100 rounded-full">
        <div className="h-1 bg-green-500 rounded-full" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-[10px] text-slate-500 mt-1">
        {activeCount}/{total} active
      </p>
    </div>
  );
}
