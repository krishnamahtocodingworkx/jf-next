// Custom Redux middleware: redux-logger + the serializable-check whitelist for redux-persist actions.
import type { ConfigureStoreOptions } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

type GetDefaultMiddleware = Parameters<
  NonNullable<NonNullable<ConfigureStoreOptions["middleware"]>>
>[0];

/** redux-persist dispatches non-serializable actions; whitelist them to avoid noisy dev warnings. */
export const PERSIST_SERIALIZE_IGNORED_ACTIONS = [
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
] as const;

/** Adds the action logger + the persist-action whitelist to the default RTK middleware stack. */
export function createAppMiddleware(getDefaultMiddleware: GetDefaultMiddleware) {
  return getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [...PERSIST_SERIALIZE_IGNORED_ACTIONS],
    },
  }).concat(logger);
}
