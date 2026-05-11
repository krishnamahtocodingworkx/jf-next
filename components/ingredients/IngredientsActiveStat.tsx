"use client";

import { Leaf, TrendingUp } from "lucide-react";

type Props = {
  activeCount: number;
};

export default function IngredientActiveStat({ activeCount }: Props) {
  return (
    <div
      className="rounded-xl p-4 text-white flex items-center justify-between"
      style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}
    >
      <div>
        <p className="text-blue-200 text-[10px] font-medium mb-0.5">Active Ingredients</p>
        <p className="text-3xl font-bold">{activeCount}</p>
        <p className="text-blue-200 text-[10px] mt-0.5">Across all products</p>
        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-green-300 font-medium">
          <TrendingUp className="h-2.5 w-2.5" />+12% this period
        </div>
      </div>
      <Leaf className="h-10 w-10 text-blue-300 opacity-50" />
    </div>
  );
}
