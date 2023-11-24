import { createSlice } from "@reduxjs/toolkit";

//Actions
import {
  todayAlarms,
  alarmData,
  validateSeprobanAlarm,
  validateCurrentAlarm,
  alarmStatus,
} from "../actions/alarmsActions";

const initialState = {
  loading: false,
  status: "idle",
  alarmNotification: [],
  alarms: [],
  alarmsCount: "",
  alarmsPages: "",
  alarmFiles: "",
  alarmInfo: "",
};

export const alarmsSlice = createSlice({
  name: "alarms",
  initialState,
  reducers: {
    setNewAlarm(state, action) {
      return { alarmInfo: action.payload };
    },
    setAlarmsCount(state, action) {
      return { alarmsCount: action.payload };
    },
    setAlarmsPages(state, action) {
      return { alarmsPages: action.payload };
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
      //Alarm data
      .addCase(alarmData.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(alarmData.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
        state.alarmInfo = action.payload;
      })
      .addCase(alarmData.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      })
      //Validate Seproban alarm
      .addCase(validateSeprobanAlarm.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(validateSeprobanAlarm.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
      })
      .addCase(validateSeprobanAlarm.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      })
      //Validate image alarm
      .addCase(validateCurrentAlarm.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(validateCurrentAlarm.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
      })
      .addCase(validateCurrentAlarm.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      })
      //Alarm status
      .addCase(alarmStatus.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(alarmStatus.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
      })
      .addCase(alarmStatus.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      });
  },
});

export const { reducer } = alarmsSlice;
export const { setNewAlarm, setAlarmsCount, setAlarmsPages, clearAlarmFiles } =
  alarmsSlice.actions;
export default reducer;
