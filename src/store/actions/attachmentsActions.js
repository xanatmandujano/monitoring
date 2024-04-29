import { createAsyncThunk } from "@reduxjs/toolkit";
//Slice
import { setMessage } from "../slices/messageSlice";
//Services
import {
  getAlarmAttachments,
  getAttachment,
} from "../../services/alarmsService";

export const alarmAttachments = createAsyncThunk(
  "alarms/alarmsAttachments",
  async ({ alarmId }, thunkAPI) => {
    try {
      const data = await getAlarmAttachments(alarmId);
      return data;
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const getAlarmAttachment = createAsyncThunk(
  "alarms/getAlarmAttachment",
  async ({ attachmentId }, thunkAPI) => {
    try {
      const data = await getAttachment(attachmentId);
      return data.data.result;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);
