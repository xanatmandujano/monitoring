import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import signalRMiddleware from "./middleware/signalRMiddleware";
//Reducers
import messageReducer from "./slices/messageSlice";
import authReducer from "./slices/authSlice";
import alarmsReducer from "./slices/alarmsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import attachmentsReducer from "./slices/attachmentsSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
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
        ],
        ignoredActionPaths: ["payload.headers"],
      },
    }),
});
