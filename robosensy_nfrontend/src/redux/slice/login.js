import { createSlice } from "@reduxjs/toolkit";
import { forgotPasswordThunk, getPermissionsThunk, loginThunk, resetPasswordThunk } from "../thunk/login";

const initialState = {
  data: null,
  loading: false,
  error: false,
  authenticated: localStorage.getItem("token") ? true : false,
  userPermissions: { data: [] }
};

const loginSlice = createSlice({
  name: "Login",
  initialState,
  reducers: {
    clearLoginData(state) {
      state.loginData = null;
      state.loading = false;
      state.error = false;
    },
    authenticationHandler(state, action) {
      state.authenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload?.result?.token);
      localStorage.setItem("user", action.payload?.result?.userName);
      localStorage.setItem("userRole", action.payload?.result?.userRole);
      localStorage.setItem("id", action.payload?.result?.id);
      return { ...state, loginData: action.payload, authenticated: true, loading: false };
    });
    builder.addCase(loginThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(forgotPasswordThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(forgotPasswordThunk.fulfilled, (state, action) => {
      return { ...state, forgotPassword: action.payload, loading: false };
    });
    builder.addCase(forgotPasswordThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(resetPasswordThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(resetPasswordThunk.fulfilled, (state, action) => {
      return { ...state, resetPassword: action.payload, loading: false };
    });
    builder.addCase(resetPasswordThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(getPermissionsThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getPermissionsThunk.fulfilled, (state, action) => {
      return { ...state, userPermissions: action.payload, loading: false };
    });
    builder.addCase(getPermissionsThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });
  }
});

export const { clearLoginData, authenticationHandler } = loginSlice.actions;
export default loginSlice.reducer;
