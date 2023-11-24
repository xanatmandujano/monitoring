import { configureStore } from "@reduxjs/toolkit";
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
});
