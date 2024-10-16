import { createSlice } from "@reduxjs/toolkit";

//Actions
import { addPlate, useCases } from "../actions/useCasesActions";

const initialState = {
  loading: false,
  status: "idle",
  useCases: [],
};

export const useCasesSlice = createSlice({
  name: "useCases",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(addPlate.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addPlate.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = false;
      })
      .addCase(addPlate.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
      })
      .addCase(useCases.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(useCases.fulfilled, (state, action) => {
        state.status = "succedded";
        state.loading = true;
        state.useCases = action.payload;
      })
      .addCase(useCases.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = true;
      });
  },
});

export const { reducer } = useCasesSlice;
export default reducer;
