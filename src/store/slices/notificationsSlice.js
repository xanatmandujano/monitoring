import { createSlice } from "@reduxjs/toolkit";
//Actions
import {
  alarmNotificationHub,
  sendMessage,
} from "../actions/notificationActions";

const initialState = {
  status: "",
  newNotification: "",
  newAction: "",
  connection: null,
  messageSent: "",
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setConnection(state, action) {
      return {
        connection: action.payload,
      };
    },
    setNewNotification(state, action) {
      return { newNotification: action.payload };
    },
    setAction(state, action) {
      return {
        newAction: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succedded";
        state.messageSent = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "rejected";
      });
  },
});

export const { reducer } = notificationsSlice;
export const { setNewNotification, setConnection, setAction } =
  notificationsSlice.actions;
export default reducer;
