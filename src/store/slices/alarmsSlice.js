import { createSlice } from "@reduxjs/toolkit";

//Actions
import { todayAlarms, alarmAttachments } from "../actions/alarmsActions";

const initialState = {
  loading: false,
  status: "idle",
  alarmNotification: "",
  alarms: [],
  alarmsCount: "",
  alarmFiles: "",
  alarmInfo: "",
};

export const alarmsSlice = createSlice({
  name: "alarms",
  initialState,
  reducers: {
    setAlarmNotification(state, action) {
      return { alarmNotification: action.payload };
    },
    setNewAlarm(state, action) {
      return { alarmInfo: action.payload };
    },
    setAlarmsCount(state, action) {
      return { alarmsCount: action.payload };
    },
    clearAlarmFiles(state, action) {
      return { alarmFiles: "" };
    },
  },
  extraReducers(builder) {
    builder
      //Get today alarms
      .addCase(todayAlarms.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(todayAlarms.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
        state.alarms = action.payload;
      })
      .addCase(todayAlarms.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      })
      //Get alarm attachments
      .addCase(alarmAttachments.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(alarmAttachments.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
        state.alarmFiles = action.payload;
      })
      .addCase(alarmAttachments.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      });
  },
});

export const { reducer } = alarmsSlice;
export const {
  setAlarmNotification,
  setNewAlarm,
  setAlarmsCount,
  clearAlarmFiles,
} = alarmsSlice.actions;
export default reducer;
