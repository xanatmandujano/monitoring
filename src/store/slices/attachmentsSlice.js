import { createSlice } from "@reduxjs/toolkit";

//Actions
import {
  alarmAttachments,
  getAlarmAttachment,
} from "../actions/attachmentsActions";

const initialState = {
  alarmFiles: "",
  alarmAttachment: "",
  status: "",
  loading: "",
};

export const attachmentsSlice = createSlice({
  name: "attachments",
  initialState,
  reducers: {
    clearAlarmAttachment(state, action) {
      return { alarmAttachment: action.payload };
    },
  },
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
      })
      .addCase(getAlarmAttachment.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.alarmAttachment = "";
      })
      .addCase(getAlarmAttachment.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
        state.alarmAttachment = action.payload;
      })
      .addCase(getAlarmAttachment.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      });
  },
});

export const { reducer } = attachmentsSlice;
export const { clearAlarmAttachment } = attachmentsSlice.actions;
export default reducer;
