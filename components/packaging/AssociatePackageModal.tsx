"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { AssociatePackageModalProps } from "@/utils/model";

export default function AssociatePackageModal({
    pkg,
    products,
    onClose,
    onSave,
    copy,
}: AssociatePackageModalProps) {
    const [selected, setSelected] = useState<string[]>(pkg.associatedProducts);

    const toggle = (id: string) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex items-start justify-between p-5 border-b border-slate-100">
                    <div>
                        <h3 className="font-semibold text-slate-800">{copy.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-tight max-w-xs">{pkg.name}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="h-4 w-4 text-slate-500" />
                    </button>
                </div>
                <div className="p-5 space-y-2 max-h-72 overflow-y-auto">
                    {products.map((prod) => {
                        const checked = selected.includes(prod.id);
                        return (
                            <button
                                key={prod.id}
                                type="button"
                                onClick={() => toggle(prod.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                                    checked ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                    checked ? "bg-blue-600 border-blue-600" : "border-slate-300"
                                }`}>
                                    {checked && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{prod.name}</p>
                                    <p className="text-xs text-slate-500">{prod.sku}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                                    prod.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                    {prod.status}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="p-5 border-t border-slate-100 flex gap-3">
                    <button
                        type="button"
                        onClick={() => onSave(pkg.id, selected)}
                        className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
                    >
                        {copy.saveButton}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        {copy.cancelButton}
                    </button>
                </div>
            </div>
        </div>
    );
}
