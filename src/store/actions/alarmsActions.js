import { createAsyncThunk } from "@reduxjs/toolkit";
//Slice
import { setMessage } from "../slices/messageSlice";
import {
  setAlarmsCount,
  setNewAlarm,
  setAlarmsPages,
} from "../slices/alarmsSlice";
//Services
import {
  getTodayAlarms,
  getAlarmAttachments,
  getAlarmData,
  validateAlarm,
  setAlarmStatus,
} from "../../services/alarmsService";

export const todayAlarms = createAsyncThunk(
  "alarms/todayAlarms",
  async (
    { pageNumber, pageSize, columnName, sortDirection, searchText },
    thunkAPI
  ) => {
    try {
      const data = await getTodayAlarms(
        pageNumber,
        pageSize,
        columnName,
        sortDirection,
        searchText
      );
      thunkAPI.dispatch(setAlarmsCount(data.totalRecords));
      //thunkAPI.dispatch(setAlarmsPages(data.totalPages));

      return data.result;
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

export const alarmData = createAsyncThunk(
  "alarms/alarmData",
  async ({ code }, thunkAPI) => {
    try {
      const data = await getAlarmData(code).then((res) => {
        if (res.data.isSuccess) {
          thunkAPI.dispatch(setNewAlarm(res.data.result));
        }
      });
      console.log(data);
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

export const validateCurrentAlarm = createAsyncThunk(
  "alarms/validateAlarm",
  async ({ alarmId, comments, devices }, thunkAPI) => {
    try {
      const data = await validateAlarm(alarmId, comments, devices);
      //console.log(data);
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

export const alarmStatus = createAsyncThunk(
  "alarms/alarmStatus",
  async ({ alarmId, statusId, comments }, thunkAPI) => {
    try {
      const data = await setAlarmStatus(alarmId, statusId, comments);
      //console.log(data);
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
