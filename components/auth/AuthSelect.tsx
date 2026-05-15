"use client";

// Styled dropdown used by the Register form (country, company type, etc.); custom chevron + inline error.
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SelectOption } from "@/utils/model";

type AuthSelectProps = {
  name: string;
  placeholder: string;
  value: string;
  options: SelectOption[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
};

export function AuthSelect({
  name,
  placeholder,
  value,
  options,
  onChange,
  onBlur,
  error,
}: AuthSelectProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsActive(true)}
          onBlur={(e) => {
            setIsActive(false);
            onBlur?.(e);
          }}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full appearance-none rounded-lg border bg-white pl-4 pr-10 text-slate-800 outline-none ring-0 transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-red-200 focus:border-red-200 focus:ring-red-200/40"
              : "border-slate-200 focus:ring-teal-500"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
          aria-hidden
        >
          <ChevronDown
            className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isActive ? "rotate-180" : "rotate-0"}`}
            strokeWidth={2}
          />
        </span>
      </div>
      <div
        className="flex h-4 w-full shrink-0 items-start pt-0.5"
        aria-live="polite"
      >
        {error ? (
          <p
            className="line-clamp-1 w-full text-[11px] font-light leading-tight text-red-500"
            title={error}
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
