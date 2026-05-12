"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type SidePanelProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    icon?: React.ReactNode;
    /** Classes for the icon container (default: blue product style). */
    iconWrapperClassName?: string;
    width?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

/** Reusable right-aligned drawer used by Add/Edit and Detail panels. */
export default function SidePanel({
    open,
    onClose,
    title,
    icon,
    iconWrapperClassName = "p-2 bg-blue-100 rounded-lg",
    width = "max-w-2xl",
    children,
    footer,
}: SidePanelProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                console.log("[SidePanel] esc close");
                onClose();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40" onClick={onClose} />
            <div className={`w-full ${width} bg-white shadow-2xl flex flex-col overflow-hidden`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div
                                className={`${iconWrapperClassName} flex items-center justify-center`}
                            >
                                {icon}
                            </div>
                        )}
                        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">{children}</div>

                {footer && (
                    <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
