import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../component/constants/defaultValues";

export const invoicethunk = createAsyncThunk("invoiceThunk", async (payload, { rejectWithValue }) => {
    try {
    const res = await axios.post(baseURL + "/invoice/addInvoice", payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
