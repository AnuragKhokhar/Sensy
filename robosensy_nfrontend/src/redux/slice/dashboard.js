import { createSlice } from "@reduxjs/toolkit";
import { dashboardThunk } from "../thunk/dashboard";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  // reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(dashboardThunk.fulfilled, (state, action) => {
        return { loading: false, dashboardData: action.payload };
      })
      .addCase(dashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error ? action.error.message : "Unknown error";
      });
  }
});

export default dashboardSlice.reducer;
