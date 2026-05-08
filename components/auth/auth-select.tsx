"use client";

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

export function AuthSelect({ name, placeholder, value, options, onChange, onBlur, error }: AuthSelectProps) {
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-slate-800 outline-none ring-teal-500 transition focus:ring-2"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
