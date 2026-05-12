"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type AuthInputProps = {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
};

export function AuthInput({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: AuthInputProps) {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={name}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full rounded-lg border bg-white px-4 pr-11 text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border-red-200 focus:border-red-200 focus:ring-red-200/40"
              : "border-slate-200 focus:ring-teal-500"
          }`}
        />
        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        ) : null}
      </div>
      <div className="flex h-4 w-full shrink-0 items-start pt-0.5" aria-live="polite">
        {error ? (
          <p className="line-clamp-1 w-full text-[11px] font-light leading-tight text-red-500" title={error} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
