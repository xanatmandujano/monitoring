import { createSlice } from "@reduxjs/toolkit";

//Actions
import { USER_LOGIN, USER_LOGOUT } from "../actions/authAction";

const userToken = sessionStorage.getItem("userToken")
  ? sessionStorage.getItem("userToken")
  : null;
const email = sessionStorage.getItem("email")
  ? sessionStorage.getItem("email")
  : null;
const userName = sessionStorage.getItem("userName")
  ? sessionStorage.getItem("userName")
  : null;
const isLoggedIn = sessionStorage.getItem("userLogged")
  ? sessionStorage.getItem("userLogged")
  : false;
const userId = sessionStorage.getItem("userId")
  ? sessionStorage.getItem("userId")
  : null;
const expiration = sessionStorage.getItem("expiration")
  ? sessionStorage.getItem("expiration")
  : null;

const initialState = {
  loading: false,
  isLoggedIn: isLoggedIn,
  status: "idle",
  email,
  userName,
  userToken,
  userId,
  expiration,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
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
      .addCase(USER_LOGOUT.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
        state.email = null;
        state.isLoggedIn = false;
      });
  },
});

export const { reducer } = authSlice;
export default reducer;
