import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

//Reducers
import messageReducer from "./slices/messageSlice";
import authReducer from "./slices/authSlice";
import alarmsReducer from "./slices/alarmsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import attachmentsReducer from "./slices/attachmentsSlice";

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
    notifications: notificationsReducer,
    attachments: attachmentsReducer,
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
        ],
      },
      thunk,
    }),
});
