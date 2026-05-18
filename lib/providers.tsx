"use client";

// Top-level client providers — Redux store, redux-persist gate, and the global toaster used by `react-hot-toast`.
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";

/** Wraps the entire app from `app/layout.tsx`; child trees can `useAppSelector` and dispatch immediately. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster />
      </PersistGate>
    </Provider>
  );
}
