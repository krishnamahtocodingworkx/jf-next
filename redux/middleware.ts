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

/** Actions redux-persist emits that must bypass serializable checks. */
export const PERSIST_SERIALIZE_IGNORED_ACTIONS = [
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
] as const;

export function createAppMiddleware(getDefaultMiddleware: GetDefaultMiddleware) {
  return getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [...PERSIST_SERIALIZE_IGNORED_ACTIONS],
    },
  }).concat(logger);
}
