import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../utils/axios";
import { baseURL } from "../../component/constants/defaultValues";

export const dashboardThunk = createAsyncThunk("dashboard", async (payload) => {
  try {
    const res = await axios.get(baseURL + `/dashboard/getCardsData?query=${payload}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});
