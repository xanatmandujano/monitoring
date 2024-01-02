import { createSlice } from "@reduxjs/toolkit";
//Actions
import { alarmNotificationHub } from "../actions/notificationActions";

const initialState = {
  newAlarm: [],
  connection: "",
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
      return {
        newAlarm: action.payload,
      };
    },
  },
});

export const { reducer } = notificationsSlice;
export const { setNewAlarm, setConnection } = notificationsSlice.actions;
export default reducer;
