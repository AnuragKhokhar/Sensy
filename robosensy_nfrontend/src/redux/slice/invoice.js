import { createSlice } from '@reduxjs/toolkit';
import { invoicethunk } from '../thunk/invoice';

const initialState = {
  invoices: [],
  status: 'idle',
  error: null,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(invoicethunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(invoicethunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoices.push(action.payload);
      })
      .addCase(invoicethunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
