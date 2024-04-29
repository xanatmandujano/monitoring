import { createSlice } from "@reduxjs/toolkit";

//Actions
import { alarmAttachments } from "../actions/attachmentsActions";

const initialState = {
  alarmFiles: "",
};

export const attachmentsSlice = createSlice({
  name: "attachments",
  initialState,
  extraReducers(builder) {
    builder
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

export const { reducer } = attachmentsSlice;
export default reducer;
