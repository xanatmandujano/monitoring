import { createAsyncThunk } from "@reduxjs/toolkit";
//Slice
import { setMessage } from "../slices/messageSlice";
//Services
import { getTodayAlarms } from "../../services/alarmsService";

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
