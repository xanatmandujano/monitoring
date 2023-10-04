import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage(state, action) {
      return { message: action.payload };
    },
    clearMessage(state, action) {
      return { message: "" };
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
