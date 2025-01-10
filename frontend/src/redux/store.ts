import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import conversationReducer from "./conversationSlice"
import llmReducer from "./llmSlice"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistUserReducer = persistReducer(persistConfig, userReducer);
const persistTranslatorReducer = persistReducer(persistConfig, llmReducer);

export const store = configureStore({
  reducer: {
    user: persistUserReducer,
    conversation: conversationReducer,
    translator: persistTranslatorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export const persiststor = persistStore(store);
