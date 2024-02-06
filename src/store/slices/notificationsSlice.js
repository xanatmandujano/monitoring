import { createSlice } from "@reduxjs/toolkit";
//Actions
import { alarmNotificationHub } from "../actions/notificationActions";

const initialState = {
  status: "",
  newAlarm: [],
  action: "",
  connection: null,
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
    setNewAlarm(state, action) {
      const alarm = action.payload;
      return { newAlarm: alarm };
    },
    setAction(state, action) {
      const act = action.payload;
      return {
        action: act,
      };
    },
  },
});

export const { reducer } = notificationsSlice;
export const { setNewAlarm, setConnection, setAction } =
  notificationsSlice.actions;
export default reducer;
