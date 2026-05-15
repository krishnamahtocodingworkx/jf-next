// Root Redux store wiring: combines the user/product/ingredient slices and persists `user` to localStorage.
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { createAppMiddleware } from "@/redux/middleware";
import userReducer from "@/redux/user/user-slice";
import productReducer from "@/redux/product/product-slice";
import ingredientReducer from "@/redux/ingredient/ingredient-slice";
import type { UserState } from "@/interfaces/auth";
import type { IngredientState } from "@/interfaces/ingredient";
import type { ProductState } from "@/utils/model";

/** No-op storage used during SSR (redux-persist tries to read `window` at module load). */
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

/** Combined reducer — each module owns its slice. */
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  ingredient: ingredientReducer,
});

/** Only `user` is persisted; catalog/detail state is re-fetched on mount so we don't ship stale lists. */
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/** Singleton store — imported by the `<AppProviders>` and (lazily) by the axios interceptor. */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => createAppMiddleware(getDefaultMiddleware),
});

export const persistor = persistStore(store);

/** Combined state shape used by `useAppSelector`. */
export type RootState = {
  user: UserState;
  product: ProductState;
  ingredient: IngredientState;
};
export type AppDispatch = typeof store.dispatch;
