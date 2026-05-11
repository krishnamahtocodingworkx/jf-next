import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { createAppMiddleware } from "@/redux/middleware";
import userReducer from "@/redux/user/user-slice";
import ingredientReducer, { ingredientsStateType } from "@/redux/ingredients/ingredientsSlice";
import type { UserState } from "@/redux/user/user-types";

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
  ingredients: ingredientReducer,
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
  middleware: (getDefaultMiddleware) => createAppMiddleware(getDefaultMiddleware),
});

export const persistor = persistStore(store);

export type RootState = {
  user: UserState;
  ingredients: ingredientsStateType;
};
export type AppDispatch = typeof store.dispatch;
