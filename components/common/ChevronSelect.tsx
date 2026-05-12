"use client";

import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChevronSelectProps = ComponentProps<"select"> & {
    wrapperClassName?: string;
    iconClassName?: string;
};

/** Native `<select>` with hidden system chevron and a single Lucide chevron overlay. */
export function ChevronSelect({
    wrapperClassName,
    className,
    iconClassName,
    disabled,
    children,
    ...rest
}: ChevronSelectProps) {
    return (
        <div className={cn("relative min-w-0", wrapperClassName)}>
            <select
                {...rest}
                disabled={disabled}
                className={cn(
                    "w-full cursor-pointer appearance-none border border-slate-200 bg-white text-sm text-slate-800",
                    "rounded-lg pl-3 pr-9 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    className,
                )}
            >
                {children}
            </select>
            <ChevronDown
                className={cn(
                    "pointer-events-none absolute right-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400",
                    disabled && "opacity-50",
                    iconClassName,
                )}
                aria-hidden
            />
        </div>
    );
}
