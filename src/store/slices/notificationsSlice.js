import { createSlice } from "@reduxjs/toolkit";
//Actions
import { alarmNotificationHub } from "../actions/notificationActions";

const initialState = {
  newAlarm: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNewAlarm(state, action) {
      return {
        newAlarm: action.payload,
      };
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(alarmNotificationHub.fulfilled, (state, action) => {
  //     state.newAlarm = action.payload;
  //   });
  // },
});

export const { reducer } = notificationsSlice;
export const { setNewAlarm } = notificationsSlice.actions;
export default reducer;
