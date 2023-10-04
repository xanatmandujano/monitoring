import { createSlice } from "@reduxjs/toolkit";

//Actions
import { todayAlarms } from "../actions/alarmsActions";

const initialState = {
  loading: false,
  status: "idle",
  alarms: [],
};

export const alarmsSlice = createSlice({
  name: "alarms",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(todayAlarms.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(todayAlarms.fulfilled, (state, action) => {
        state.status = "fullfilled";
        state.loading = false;
        state.alarms = action.payload;
      })
      .addCase(todayAlarms.rejected, (state, action) => {
        (state.status = "rejected"), (state.loading = false);
      });
  },
});

export const { reducer } = alarmsSlice;
export default reducer;
