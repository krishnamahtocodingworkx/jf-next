import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { logger } from "redux-logger";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import userReducer from "@/redux/user/user-slice";

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: string) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
