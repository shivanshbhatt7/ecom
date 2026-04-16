import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import productSlice from "./productSlice";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// ✅ FIXED STORAGE (works in Vite, Next, etc.)
import createWebStorage from "redux-persist/es/storage/createWebStorage";

// fallback storage (for non-browser environments)
const createNoopStorage = () => {
  return {
    getItem: () => Promise.resolve(null),
    setItem: (_, value) => Promise.resolve(value),
    removeItem: () => Promise.resolve(),
  };
};

// use correct storage
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// persist config
const persistConfig = {
  key: "Ekart",
  version: 1,
  storage,
};

// reducers
const rootReducer = combineReducers({
  user: userSlice,
  product: productSlice,
});

// persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// persistor
export const persistor = persistStore(store);