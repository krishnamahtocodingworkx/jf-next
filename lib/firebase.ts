// Firebase initialisation — exports a singleton `auth` and a thin analytics helper used by login analytics events.
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAnalytics, logEvent, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

/** Local extension of `FirebaseOptions` for fields not in the base type. */
export interface FirebaseConfig extends FirebaseOptions {
  databaseURL?: string;
  measurementId?: string;
}

/** Config sourced from `NEXT_PUBLIC_FIREBASE_*` env vars (all client-safe). */
export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Reuse an existing app instance during HMR / SSR to avoid the "already initialised" Firebase error.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/** Shared Firebase Auth singleton — imported by services and the axios interceptor. */
export const auth = getAuth(app);

// Analytics is browser-only; skip the import on the server side.
const analytics: Analytics | null =
  typeof window !== "undefined" ? getAnalytics(app) : null;

/** No-op when analytics isn't available (SSR / consent withheld). */
export function fireBaseLogEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (!analytics) return;
  logEvent(analytics, eventName, params);
}

export default app;
