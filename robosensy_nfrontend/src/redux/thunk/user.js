import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../utils/axios";
import { baseURL } from "../../component/constants/defaultValues";

export const getAllUsers = createAsyncThunk("getAllUsers", async (payload) => {
  try {
    const res = await axios.get(baseURL + `/admin/getAllUsers?pageSize=${payload.pageSize}&currentPage=${payload.currentPage}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getUserDetails = createAsyncThunk("getUserDetails", async () => {
  try {
    const res = await axios.get(baseURL + `/admin/getDetails`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getAllPermissions = createAsyncThunk("getAllPermissions", async () => {
  try {
    const res = await axios.get(baseURL + `/admin/getAllPermissions`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const updatePermissions = createAsyncThunk("updatePermissions", async (payload) => {
  try {
    const res = await axios.patch(baseURL + `/admin/updatepermissions/` + payload._id, payload.body);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const registerAdmin = createAsyncThunk("registerAdmin", async (payload) => {
  try {
    const res = await axios.post(baseURL + `/admin/register`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});
