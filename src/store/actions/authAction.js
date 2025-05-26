import { createAsyncThunk } from "@reduxjs/toolkit";
//Slice
import { setAuthInfo } from "../slices/authSlice";
import { setMessage } from "../slices/messageSlice";
//Services
import { login, refreshToken, hasPermission } from "../../services/authService";
import { releaseViewedAlarm } from "../../services/alarmsService";

export const USER_LOGIN = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await login(email, password);
      const permissionsId = response.permissions.map(
        (item) => item.permissionId
      );
      thunkAPI.dispatch(
        setAuthInfo({
          isLoggedIn: response.isSuccess,
          email: email,
          userName: response.fullName,
          userId: response.userId,
          userToken: response.token.accessToken,
          expiration: response.token.expiration,
          refresh: response.token.refreshToken,
          permissions: permissionsId,
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
  async (arg, thunkAPI) => {
    try {
      const response = await refreshToken();
      thunkAPI.dispatch(
        setAuthInfo({
          userToken: response.accessToken,
          expiration: response.expiration,
          refresh: response.refreshToken,
        })
      );
      console.log(response);
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
            //isLoggedIn: "",
            //email: "",
            userName: "",
            userId: "",
            userToken: "",
            expiration: "",
            refresh: "",
            permissions: "",
          })
        );
        console.log(response);
        return response;
      } else {
        thunkAPI.dispatch(
          setAuthInfo({
            //isLoggedIn: "",
            //email: "",
            userName: "",
            userId: "",
            userToken: "",
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

export const HAS_PERMISSION = createAsyncThunk(
  "auth/hasPermission",
  async (alarmCode, thunkAPI) => {
    try {
      const response = await hasPermission(alarmCode);
      console.log(response);
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
