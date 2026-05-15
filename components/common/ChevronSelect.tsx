"use client";

import type { ComponentProps } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

export type ChevronSelectProps = ComponentProps<"select"> & {
    wrapperClassName?: string;
    iconClassName?: string;
    onOpenIntent?: () => void;
};

/** Native `<select>` with hidden system chevron and a single Lucide chevron overlay. */
export function ChevronSelect({
    wrapperClassName,
    className,
    iconClassName,
    onOpenIntent,
    onPointerDown,
    onFocus,
    disabled,
    children,
    ...rest
}: ChevronSelectProps) {
    return (
        <div className={twMerge(clsx("relative min-w-0", wrapperClassName))}>
            <select
                {...rest}
                disabled={disabled}
                onPointerDown={(e) => {
                    if (!disabled) {
                        if (e.pointerType !== "mouse" || e.button === 0) {
                            onOpenIntent?.();
                        }
                    }
                    onPointerDown?.(e);
                }}
                onFocus={(e) => {
                    if (!disabled) {
                        onOpenIntent?.();
                    }
                    onFocus?.(e);
                }}
                className={twMerge(
                    clsx(
                        "box-border min-h-10 w-full min-w-0 cursor-pointer border border-[#ced4da] bg-white text-sm text-[#212529]",
                        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.075)]",
                        "appearance-none [-webkit-appearance:none] [-moz-appearance:none]",
                        "[&::-ms-expand]:hidden",
                        "rounded pl-3 pr-9 py-2 leading-normal focus:outline-none focus:border-[#86b7fe] focus:ring-[3px] focus:ring-[#86b7fe]/25",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        className,
                    ),
                )}
            >
                {children}
            </select>
            <ChevronDown
                className={twMerge(
                    clsx(
                        "pointer-events-none absolute right-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-[#6c757d]",
                        disabled && "opacity-50",
                        iconClassName,
                    ),
                )}
                aria-hidden
            />
        </div>
    );
}
