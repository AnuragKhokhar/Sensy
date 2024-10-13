import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../utils/axios";
import { baseURL } from "../../component/constants/defaultValues";

export const loginThunk = createAsyncThunk("loginThunk", async (payload) => {
  try {
    const res = await axios.post(baseURL + "/admin/login", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const forgotPasswordThunk = createAsyncThunk("forgotPasswordThunk", async (payload) => {
  try {
    const res = await axios.post(baseURL + "/admin/forgot-password", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const resetPasswordThunk = createAsyncThunk("resetPasswordThunk", async (payload) => {
  try {
    const res = await axios.patch(baseURL + `/admin/reset-password/${payload.token}`, { password: payload.password });
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getPermissionsThunk = createAsyncThunk("getPermissions", async (id) => {
  try {
    const res = await axios.get(baseURL + `/admin/getPermissions/` + id);
    return res.data;
  } catch (error) {
    throw error;
  }
});
