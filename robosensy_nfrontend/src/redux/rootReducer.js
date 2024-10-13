import { combineSlices } from "@reduxjs/toolkit";
import PatientSlice from "./slice/patient";
import LoginSlice from "./slice/login";
import dashboardSlice from "./slice/dashboard.js";
import AppointmentSlice from "./slice/appointment.js";
import DoctorSlice from "./slice/doctor.js";
import InvoiceSlice from "./slice/invoice.js";
import UserSlice from "./slice/user.js";
import optionsReducer from "./slice/options.js";

export default combineSlices({ PatientSlice, LoginSlice, dashboardSlice, AppointmentSlice, InvoiceSlice, DoctorSlice, UserSlice,options:optionsReducer });
