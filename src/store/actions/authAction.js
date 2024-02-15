import { createAsyncThunk } from "@reduxjs/toolkit";
//Slice
import { setAuthInfo, setRefreshToken } from "../slices/authSlice";
import { setMessage } from "../slices/messageSlice";
//Services
import { login, refreshToken } from "../../services/authService";
import { releaseViewedAlarm } from "../../services/alarmsService";

export const USER_LOGIN = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await login(email, password);
      thunkAPI.dispatch(
        setAuthInfo({
          isLoggedIn: response.isSuccess,
          email: email,
          userName: response.fullName,
          userToken: response.token.accessToken,
          userId: response.userId,
          expiration: response.token.expiration,
          refresh: response.token.refreshToken,
        })
      );
      return response;
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

export const REFRESH_TOKEN = createAsyncThunk(
  "auth/token",
  async (thunkAPI) => {
    try {
      const response = await refreshToken();
      thunkAPI.dispatch(
        setRefreshToken({
          userToken: response.accessToken,
          expiration: response.expiration,
          refresh: response.refreshToken,
        })
      );
      return response;
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

export const USER_LOGOUT = createAsyncThunk(
  "auth/logout",
  async ({ alarmId, isLogged }, thunkAPI) => {
    try {
      if (alarmId) {
        const response = releaseViewedAlarm(alarmId);
        thunkAPI.dispatch(
          setAuthInfo({
            isLoggedIn: isLogged,
            email: "",
            userName: "",
            userToken: "",
            userId: "",
            expiration: "",
            refresh: "",
          })
        );
        console.log(response);
        return response;
      } else {
        thunkAPI.dispatch(
          setAuthInfo({
            isLoggedIn: isLogged,
            email: "",
            userName: "",
            userToken: "",
            userId: "",
            expiration: "",
            refresh: "",
          })
        );
      }
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
