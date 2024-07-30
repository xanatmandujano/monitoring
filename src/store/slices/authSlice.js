import { createSlice } from "@reduxjs/toolkit";

//Actions
import { USER_LOGIN, REFRESH_TOKEN, USER_LOGOUT } from "../actions/authAction";

const initialState = {
  loading: false,
  status: "idle",
  authInfo: {
    isLoggedIn: false,
    email: "",
    userName: "",
    userId: "",
    userToken: "",
    expiration: "",
    refresh: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthInfo(state, action) {
      return {
        authInfo: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(USER_LOGIN.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(USER_LOGIN.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
      })
      .addCase(USER_LOGIN.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
        state.email = null;
      })
      .addCase(REFRESH_TOKEN.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(REFRESH_TOKEN.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
      })
      .addCase(REFRESH_TOKEN.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      })
      .addCase(USER_LOGOUT.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
        state.email = null;
        state.isLoggedIn = false;
      });
  },
});

export const { reducer } = authSlice;
export const { setAuthInfo } = authSlice.actions;
export default reducer;
