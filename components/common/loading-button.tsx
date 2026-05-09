"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CircularLoader } from "@/components/common/circular-loader";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
  loaderClassName?: string;
};

export function LoadingButton({
  isLoading = false,
  loadingLabel,
  children,
  disabled,
  className = "",
  loaderClassName = "",
  type = "button",
  ...rest
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={className}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <CircularLoader className={loaderClassName} />
          <span>{loadingLabel ?? children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
