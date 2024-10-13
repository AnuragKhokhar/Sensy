import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../utils/axios";
import { baseURL } from "../../component/constants/defaultValues";

export const getPatientThunk = createAsyncThunk("patientThunk", async (payload) => {
  try {
    const res = await axios.get(baseURL + `/patients/getAllPatients?pageSize=${payload.pageSize}&pageIndex=${payload.pageIndex}${payload.value ? "&query=" + payload.value : ""}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});


export const getAppointmentTypeThunk = createAsyncThunk("appointmentTypeThunk", async () => {
  try {
    const res = await axios.get(baseURL + `/department/getAllDepartment`);
    return res.data.departments;
  } catch (error) {
    throw error;
  }
});

export const addPatientThunk = createAsyncThunk("addPAtientThunk", async (payload) => {
  try {
    const res = await axios.post(baseURL + "/patients/addPatient", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const updatePatientThunk = createAsyncThunk("updatePatientThunk", async (payload) => {
  try {
    const res = await axios.patch(baseURL + `/patients/updatePatient/${payload?.id}`, payload.data);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const deletePatientThunk = createAsyncThunk("deletePatientThunk", async (payload) => {
  try {
    const res = await axios.patch(baseURL + `/patients/deletePatient/${payload}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const scheduleAppointmentThunk = createAsyncThunk("scheduleAppointmentThunk", async (payload) => {
  try {
    const res = await axios.post(baseURL + "/appointment/scheduleAppointment", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const getPatientAppoinment = createAsyncThunk("getPatientAppoinment", async (id) => {
  try {
    const res = await axios.get(baseURL + `/appointment/getByPatient/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const uploadPatientDoc = createAsyncThunk("uploadPatientDoc", async (payload) => {
  try {
    const res = await axios.post(baseURL + `/patients/uploadDocument/${payload.id}`, payload.data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const deleteDocumentThunk = createAsyncThunk("deleteDocumentThunk", async (payload) => {
  try {
    const res = await axios.post(baseURL + `/patients/deleteDoc`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});




export const deleteMultipleFileThunk = createAsyncThunk("deleteMultipleFileThunk", async (payload) => {
  try {
    const res = await axios.post(baseURL + "/patients/deleteMultipleDocs", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
});