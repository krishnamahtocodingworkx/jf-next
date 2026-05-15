"use client";

// Typed Redux hooks — import these instead of `useDispatch` / `useSelector` to get full type-safety.
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";

/** Typed `useDispatch` bound to our store; gives autocomplete for thunks and actions. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Typed `useSelector` bound to `RootState` so selectors return the right shape. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
