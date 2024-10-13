import { createSlice } from "@reduxjs/toolkit";
import { appointmentThunk, cancelAppointmentThunk, prescriptionThunk, rescheduleAppointmentThunk, viewPrescriptionThunk, notesThunk, getSingleAppointment, getTestThunk, getMedicineThunk, getRemarksThunk } from "../thunk/appointments";
import { toast } from "react-toastify";

const initialState = {
  allAppoinments: null,
  loading: false,
  error: false
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(appointmentThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(appointmentThunk.fulfilled, (state, action) => {
      return { ...state, allAppoinments: action.payload, loading: false };
    });
    builder.addCase(appointmentThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(prescriptionThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(prescriptionThunk.fulfilled, (state, action) => {
      toast.success("Presciption Added Successfully");
      return { ...state, prescription: action.payload, loading: false };
    });
    builder.addCase(prescriptionThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(notesThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(notesThunk.fulfilled, (state, action) => {
      toast.success("Note Added Successfully");
      return { ...state, note: action.payload, loading: false };
    });
    builder.addCase(notesThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(rescheduleAppointmentThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(rescheduleAppointmentThunk.fulfilled, (state, action) => {
      toast.success("Successfully Rescheduled");
      return { ...state, appointment: action.payload, loading: false };
    });
    builder.addCase(rescheduleAppointmentThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(cancelAppointmentThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
      toast.success("Appointment Cancelled Successfully");
      return { ...state, canceledAppoinment: action.payload, loading: false };
    });
    builder.addCase(cancelAppointmentThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(viewPrescriptionThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(viewPrescriptionThunk.fulfilled, (state, action) => {
      return { ...state, prescriptionHistory: action.payload, loading: false };
    });
    builder.addCase(viewPrescriptionThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(getSingleAppointment.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getSingleAppointment.fulfilled, (state, action) => {
      return { ...state, singleAppointmentData: action.payload, loading: false };
    });
    builder.addCase(getSingleAppointment.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(getTestThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getTestThunk.fulfilled, (state, action) => {
      return { ...state, testData: action.payload, loading: false };
    });
    builder.addCase(getTestThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(getMedicineThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getMedicineThunk.fulfilled, (state, action) => {
      return { ...state, medicineData: action.payload, loading: false };
    });
    builder.addCase(getMedicineThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });

    builder.addCase(getRemarksThunk.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getRemarksThunk.fulfilled, (state, action) => {
      if (action.meta.arg == "timing") {
        return { ...state, timingData: action.payload, loading: false };
      } else if (action.meta.arg == "period") {
        return { ...state, periodData: action.payload, loading: false };
      } else if (action.meta.arg == "frequency") {
        return { ...state, frequencyData: action.payload, loading: false };
      }
    });
    builder.addCase(getRemarksThunk.rejected, (state) => {
      return { ...state, loading: false, error: "Something went wrong" };
    });
  }
});

export default appointmentSlice.reducer;
