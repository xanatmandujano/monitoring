import { createSlice } from "@reduxjs/toolkit";

//Actions
import { userLogin, userLogout } from "../actions/authAction";

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

const initialState = {
  loading: false,
  isLoggedIn: isLoggedIn,
  status: "idle",
  email,
  userName,
  userToken,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(userLogin.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
        state.email = null;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
        state.email = null;
        state.isLoggedIn = false;
      });
  },
});

export const { reducer } = authSlice;
export default reducer;
