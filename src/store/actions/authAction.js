import { createAsyncThunk } from "@reduxjs/toolkit";
//Slice
import { setMessage } from "../slices/messageSlice";
import { setIsSuccess } from "../slices/authSlice";
//Services
import { login, logout } from "../../services/authService";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await login(email, password).then((res) => {
        if (res.data.isSuccess) {
          thunkAPI.dispatch(setIsSuccess(res.data.isSuccess));
          //console.log(res);
          return res;
        } else {
          thunkAPI.dispatch(setMessage(res.data.message));
          thunkAPI.dispatch(setIsSuccess(res.data.isSuccess));
          //console.log(res);
          return res.data.isSuccess;
        }
      });
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

export const userLogout = createAsyncThunk("auth/logout", async () => {
  logout();
});
