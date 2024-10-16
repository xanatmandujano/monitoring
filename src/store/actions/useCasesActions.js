import { createAsyncThunk } from "@reduxjs/toolkit";
//Slice
import { setMessage } from "../slices/messageSlice";
//Services
import { getUseCases, addPlateToUseCase } from "../../services/useCaseService";

export const useCases = createAsyncThunk(
  "useCases/getUseCases",
  async (
    { pageNumber, pageSize, columnName, sortDirection, searchText },
    thunkAPI
  ) => {
    try {
      const data = await getUseCases(
        pageNumber,
        pageSize,
        columnName,
        sortDirection,
        searchText
      );
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

export const addPlate = createAsyncThunk(
  "useCases/addPlate",
  async ({ plateText, useCaseCode }, thunkAPI) => {
    try {
      const data = await addPlateToUseCase(plateText, useCaseCode);
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
