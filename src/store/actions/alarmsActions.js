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
  getAlarmsHistory,
  getTodayAlarms,
  getAlarmData,
  validateAlarm,
  validateImageAlarm,
  setAlarmStatus,
  releaseViewedAlarm,
} from "../../services/alarmsService";
//Axios
import axios from "axios";

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

export const alarmsHistory = createAsyncThunk(
  "alarms/alarmsHistory",
  async (
    { pageNumber, pageSize, columnName, sortDirection, searchText },
    thunkAPI
  ) => {
    try {
      const data = await getAlarmsHistory(
        pageNumber,
        pageSize,
        columnName,
        sortDirection,
        searchText
      );
      thunkAPI.dispatch(setAlarmsPages(data.totalPages));

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

export const alarmData = createAsyncThunk(
  "alarms/alarmData",
  async ({ code }, thunkAPI) => {
    try {
      const data = await getAlarmData(code).then((res) => {
        if (res.data.isSuccess) {
          thunkAPI.dispatch(setNewAlarm(res.data.result));
        }
      });
      console.log(code);
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

export const validateSeprobanAlarm = createAsyncThunk(
  "alarms/validateAlarm",
  async (
    { alarmId, comments, alarmUser, alarmTime, devices, allDevices, signal },
    thunkAPI
  ) => {
    try {
      const data = await validateAlarm(
        alarmId,
        comments,
        alarmUser,
        alarmTime,
        devices,
        allDevices,
        signal
      );
      return data;
    } catch (error) {
      if (axios.isCancel(error)) {
        thunkAPI.dispatch(setMessage(error.message));
      }
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
  "alarms/validateCurrentAlarm",
  async ({ alarmId, comments }, thunkAPI) => {
    try {
      const data = await validateImageAlarm(alarmId, comments);
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

export const releaseAlarm = createAsyncThunk(
  "alarms/releaseAlarm",
  async ({ alarmId }, thunkAPI) => {
    try {
      const data = await releaseViewedAlarm(alarmId);
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
