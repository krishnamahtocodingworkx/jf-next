// import {
//   initializeApp,
//   getApps,
//   type FirebaseOptions,
// } from "firebase/app";
// import { getAuth, type Auth } from "firebase/auth";

// /** Values from `.env`; optional fields merge with NEXT_PUBLIC_FIREBASE_* (override wins). */
// export function getFirebaseAuth(
//   override?: Partial<FirebaseOptions>
// ): Auth {
//   return resolveAuth(override);
// }

// function firebaseConfigFromEnv(): FirebaseOptions {
//   return {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
//   };
// }

// let authSingleton: Auth | null = null;

// function resolveAuth(override?: Partial<FirebaseOptions>): Auth {
//   if (authSingleton) {
//     return authSingleton;
//   }
//   const config: FirebaseOptions = {
//     ...firebaseConfigFromEnv(),
//     ...override,
//   };
//   if (process.env.NODE_ENV === "development") {
//     const required: (keyof FirebaseOptions)[] = [
//       "apiKey",
//       "authDomain",
//       "projectId",
//       "storageBucket",
//       "messagingSenderId",
//       "appId",
//     ];
//     const missing = required.filter((key) => !config[key]);
//     if (missing.length > 0) {
//       console.log("[firebase] missing config keys:", missing.join(", "));
//     }
//   }
//   const app =
//     getApps().length > 0 ? getApps()[0]! : initializeApp(config);
//   authSingleton = getAuth(app);
//   return authSingleton;
// }

// /** Prefer calling `getFirebaseAuth(partialConfigFromProps)` once before any auth use when overriding from props. */
// export const auth: Auth = new Proxy({} as Auth, {
//   get(_target, prop, receiver) {
//     const real = resolveAuth();
//     const value = Reflect.get(real, prop, receiver);
//     if (typeof value === "function") {
//       return value.bind(real);
//     }
//     return value;
//   },
// });

// // Log event helper
// export const fireBaseLogEvent = (
//   eventName: string,
//   params?: Record<string, unknown>
// ) => {
//   if (!analytics) return;

//   logEvent(analytics, eventName, params);
// };


import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseOptions,
} from "firebase/app";

import {
  getAnalytics,
  logEvent,
  type Analytics,
} from "firebase/analytics";

import { getAuth } from "firebase/auth";

export interface FirebaseConfig extends FirebaseOptions {
  databaseURL?: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Prevent duplicate app initialization in Next.js
 */
const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

/**
 * Firebase Auth
 */
export const auth = getAuth(app);

/**
 * Analytics
 * Only initialize in browser
 */
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

/**
 * Firebase event logger
 */
export const fireBaseLogEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (!analytics) return;

  logEvent(analytics, eventName, params);
};

export default app;