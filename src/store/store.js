import { configureStore } from "@reduxjs/toolkit";
//Reducers
import messageReducer from "./slices/messageSlice";
import authReducer from "./slices/authSlice";
import alarmsReducer from "./slices/alarmsSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
    alarms: alarmsReducer,
  },
});
