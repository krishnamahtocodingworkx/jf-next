"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
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

/** Generic async combobox — debounced `onSearch`, dropdown results, optional prefetch on focus. */
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
  const searchGenRef = useRef(0);

  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const syncInputFromValue = useCallback(() => {
    if (!value) {
      setInputText("");
      return;
    }
    const label = resolveLabel?.(value);
    setInputText(label ?? "");
  }, [value, resolveLabel]);

  useEffect(() => {
    syncInputFromValue();
  }, [syncInputFromValue]);

  useEffect(() => {
    if (!isOpen) return;
    const q = inputText.trim();
    if (q.length < minSearchLength) {
      setOptions([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    const gen = ++searchGenRef.current;
    setLoading(true);
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const results = await onSearch(q);
          if (searchGenRef.current !== gen) return;
          setOptions(results);
          setActiveIndex(results.length > 0 ? 0 : -1);
          console.log("[AsyncAutocomplete] search", {
            q,
            count: results.length,
          });
        } catch (err) {
          if (searchGenRef.current !== gen) return;
          setOptions([]);
          setActiveIndex(-1);
          console.log("[AsyncAutocomplete] search failed", err);
        } finally {
          if (searchGenRef.current === gen) setLoading(false);
        }
      })();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputText, isOpen, minSearchLength, debounceMs, onSearch]);

  useEffect(() => {
    const onDocPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        syncInputFromValue();
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [syncInputFromValue]);

  const openAndPrefetch = () => {
    if (disabled) return;
    onOpenIntent?.();
    setIsOpen(true);
    console.log("[AsyncAutocomplete] open");
  };

  const selectOption = (option: T) => {
    onChange(option.value, option);
    setInputText(getOptionLabel(option));
    setIsOpen(false);
    setOptions([]);
    setActiveIndex(-1);
  };

  const clearSelection = () => {
    onChange("", undefined);
    setInputText("");
    setOptions([]);
    setActiveIndex(-1);
    setIsOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      openAndPrefetch();
      return;
    }
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      syncInputFromValue();
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

  const showDropdown =
    isOpen &&
    !disabled &&
    (loading ||
      options.length > 0 ||
      inputText.trim().length >= minSearchLength);

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
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (!isOpen) setIsOpen(true);
            onOpenIntent?.();
          }}
          onFocus={() => openAndPrefetch()}
          onKeyDown={onKeyDown}
          className={twMerge(
            clsx(
              "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 outline-none focus:ring-0",
              disabled && "cursor-not-allowed",
              inputClassName,
            ),
          )}
        />
        {(value || inputText.trim().length > 0) && !disabled ? (
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

      {loading && isOpen ? (
        <p className="mt-1 text-xs text-slate-500">{loadingMessage}</p>
      ) : null}

      {showDropdown && !loading && options.length === 0 ? (
        <p className="mt-1 text-xs text-slate-500">{emptyMessage}</p>
      ) : null}

      {showDropdown && options.length > 0 ? (
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
