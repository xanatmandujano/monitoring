import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { setupListeners } from "@reduxjs/toolkit/query";

//Reducers
import messageReducer from "./slices/messageSlice";
import authReducer from "./slices/authSlice";
import alarmsReducer from "./slices/alarmsSlice";
import attachmentsReducer from "./slices/attachmentsSlice";
//API
import { branchesStatusApi } from "./api/branchesStatusApi";
import { signalRApi } from "./api/signalRApi";

const persistConfig = {
  key: "root",
  storage,
  whiteList: ["authState"],
};

const rootReducer = combineReducers({
  authState: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    message: messageReducer,
    //auth: authReducer,
    persist: persistedReducer,
    alarms: alarmsReducer,
    attachments: attachmentsReducer,
    [branchesStatusApi.reducerPath]: branchesStatusApi.reducer,
    [signalRApi.reducerPath]: signalRApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "alarms/alarmStatus/fulfilled",
          "alarms/validateCurrentAlarm/fulfilled",
          "alarms/validateAlarm/fulfilled",
          "alarms/releaseAlarm/fulfilled",
        ],
        ignoredActionPaths: [
          "payload.headers",
          "payload.config",
          "payload",
          "register",
          "rehydrate",
          "meta.arg.signal",
          "meta.baseQueryMeta.request",
          "meta.baseQueryMeta.response",
        ],
      },
      thunk,
    }).concat(branchesStatusApi.middleware, signalRApi.middleware),
});

setupListeners(store.dispatch);
