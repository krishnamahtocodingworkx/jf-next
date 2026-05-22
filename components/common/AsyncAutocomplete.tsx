"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";
import type { SelectOption } from "@/utils/model";

export type AsyncAutocompleteOption = SelectOption;

export type AsyncAutocompleteProps<
  T extends AsyncAutocompleteOption = AsyncAutocompleteOption,
> = {
  value: string;
  onChange: (value: string, option?: T) => void;
  onSearch: (query: string) => Promise<T[]>;
  resolveLabel?: (value: string) => string | undefined;
  getOptionLabel?: (option: T) => string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  debounceMs?: number;
  minSearchLength?: number;
  emptyMessage?: string;
  loadingMessage?: string;
  onOpenIntent?: () => void;
  id?: string;
  "aria-label"?: string;
};

/** Async combobox: type to search, pick from the list, clear with X. */
export function AsyncAutocomplete<
  T extends AsyncAutocompleteOption = AsyncAutocompleteOption,
>({
  value,
  onChange,
  onSearch,
  resolveLabel,
  getOptionLabel = (o) => o.label,
  placeholder = "Search…",
  disabled = false,
  className,
  inputClassName,
  debounceMs = 400,
  minSearchLength = 0,
  emptyMessage = "No results found",
  loadingMessage = "Searching…",
  onOpenIntent,
  id: idProp,
  "aria-label": ariaLabel,
}: AsyncAutocompleteProps<T>) {
  const autoId = useId();
  const listboxId = `${idProp ?? autoId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const searchIdRef = useRef(0);

  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedLabel = value ? (resolveLabel?.(value) ?? "") : "";
  const query = inputText.trim();
  const ready = isOpen && query.length >= minSearchLength;
  const inputValue = isOpen ? inputText : selectedLabel;

  // Debounced search while the dropdown is open
  useEffect(() => {
    if (!ready) return;

    const searchId = ++searchIdRef.current;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const results = await onSearch(query);
          if (searchIdRef.current !== searchId) return;
          setOptions(results);
          setActiveIndex(results.length > 0 ? 0 : -1);
        } catch {
          if (searchIdRef.current !== searchId) return;
          setOptions([]);
          setActiveIndex(-1);
        } finally {
          if (searchIdRef.current === searchId) setLoading(false);
        }
      })();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [ready, query, debounceMs, onSearch]);

  // Close when clicking outside
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const openDropdown = () => {
    if (disabled) return;
    onOpenIntent?.();
    setInputText(selectedLabel);
    setIsOpen(true);
    if (selectedLabel.trim().length >= minSearchLength) setLoading(true);
  };

  const selectOption = (option: T) => {
    onChange(option.value, option);
    setInputText(getOptionLabel(option));
    setIsOpen(false);
    setOptions([]);
    setActiveIndex(-1);
    setLoading(false);
  };

  const clearSelection = () => {
    onChange("", undefined);
    setInputText("");
    setOptions([]);
    setActiveIndex(-1);
    setIsOpen(false);
    setLoading(false);
  };

  const onInputChange = (text: string) => {
    setInputText(text);
    if (!isOpen) setIsOpen(true);
    onOpenIntent?.();

    if (text.trim().length < minSearchLength) {
      setOptions([]);
      setActiveIndex(-1);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      openDropdown();
      return;
    }
    if (!isOpen) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter" && activeIndex >= 0 && options[activeIndex]) {
      e.preventDefault();
      selectOption(options[activeIndex]);
    }
  };

  const showList = isOpen && !disabled && ready;

  return (
    <div ref={rootRef} className={twMerge(clsx("relative min-w-0", className))}>
      <div
        className={twMerge(
          clsx(
            "flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5",
            "focus-within:ring-2 focus-within:ring-blue-500",
            disabled && "cursor-not-allowed bg-slate-50 opacity-60",
          ),
        )}
      >
        <input
          id={idProp ?? autoId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={openDropdown}
          onKeyDown={onKeyDown}
          className={twMerge(
            clsx(
              "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 outline-none focus:ring-0",
              disabled && "cursor-not-allowed",
              inputClassName,
            ),
          )}
        />
        {(value || inputValue.trim().length > 0) && !disabled ? (
          <button
            type="button"
            className="shrink-0 p-0.5"
            aria-label="Clear"
            onClick={clearSelection}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </button>
        ) : null}
      </div>

      {loading && isOpen && ready ? (
        <p className="mt-1 text-xs text-slate-500">{loadingMessage}</p>
      ) : null}

      {showList && !loading && options.length === 0 ? (
        <p className="mt-1 text-xs text-slate-500">{emptyMessage}</p>
      ) : null}

      {showList && options.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={idx === activeIndex}
            >
              <button
                type="button"
                className={twMerge(
                  clsx(
                    "w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50",
                    idx === activeIndex && "bg-slate-50",
                  ),
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(opt)}
              >
                {getOptionLabel(opt)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
