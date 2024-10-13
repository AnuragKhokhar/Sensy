import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../utils/axios";
import { baseURL } from "../../component/constants/defaultValues";

export const appointmentThunk = createAsyncThunk("appointmentThunk", async (payload) => {
  try {
    const res = await axios.get(baseURL + `/appointment/getAllAppointment?status=${payload.status}&date=${payload.date}&search=${payload.search}&pageSize=${payload.pageSize}&pageIndex=${payload.pageIndex}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const prescriptionThunk = createAsyncThunk("prescriptionThunk", async (payload) => {
  try {
    const res = await axios.put(baseURL + `/appointment/addPrescription?markAsCompleted=${payload.markAsCompleted ? true : false}`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const notesThunk = createAsyncThunk("notesThunk", async (payload) => {
  try {
    const res = await axios.post(baseURL + "/appointment/addNotes", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const rescheduleAppointmentThunk = createAsyncThunk("rescheduleAppointmentThunk", async (payload) => {
  try {
    const res = await axios.patch(baseURL + "/appointment/rescheduleAppointment/" + payload.id, { date: payload.date, time: payload.time });
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const cancelAppointmentThunk = createAsyncThunk("cancelAppointmentThunk", async (id) => {
  try {
    const res = await axios.patch(baseURL + "/appointment/cancelAppointment/" + id);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const viewPrescriptionThunk = createAsyncThunk("viewPrescriptionThunk", async (id) => {
  try {
    const res = await axios.get(baseURL + `/appointment/viewPrescription?id=${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const downloadPrescriptionPdf = createAsyncThunk("downloadPrescriptionPdf", async (id) => {
  try {
    const res = await axios.get(baseURL + `/appointment/generatePdf?appointmentID=${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const sendPrescriptionThunk = createAsyncThunk("sendPrescription", async (id) => {
  try {
    const res = await axios.post(baseURL + `/appointment/sendPrescription/` + id);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getSingleAppointment = createAsyncThunk("getSingleAppointment", async (id) => {
  try {
    const res = await axios.get(baseURL + `/appointment/getSingleAppointment?appointmentId=${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getTestThunk = createAsyncThunk("getTestThunk", async () => {
  try {
    const res = await axios.get(baseURL + `/labtest/getlabtests`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getMedicineThunk = createAsyncThunk("getMedicineThunk", async () => {
  try {
    const res = await axios.get(baseURL + `/medicine/getmedicine`);
    return res.data;
  } catch (error) {
    throw error;
  }
});
export const completeAppointmentthunk = createAsyncThunk("completeAppointmentthunk", async (id) => {
  try {
    const res = await axios.patch(baseURL + `/appointment/completeAppointment/` + id);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getRemarksThunk = createAsyncThunk("getRemarksThunk", async (remarks) => {
  try {
    const res = await axios.get(baseURL + `/remark/getremarks?type=${remarks}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});
