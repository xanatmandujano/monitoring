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
  isSuccess: "",
  status: "idle",
  email,
  userName,
  userToken,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsSuccess(state, action) {
      return { isSuccess: action.payload };
    },
    clearIsSuccess(state, action) {
      return { isSuccess: "" };
    },
  },
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
export const { setIsSuccess, clearIsSuccess } = authSlice.actions;
export default reducer;
