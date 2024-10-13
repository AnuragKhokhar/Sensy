import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../views/Dashboard/Dashboard";
import Patients from "../views/Patients/Patients";
import { useSelector } from "react-redux";
import Appointment from "../views/Appointments/Appointment";
import { ToastContainer } from "react-toastify";
import PatientAppointment from "../views/Appointments/PatientAppointment";
import Homepage from "../views/Homepage/v2/Homepage";
import Doctor from "../views/Doctor/Doctor";
import MedicineTable from "../views/Medicine/MedicineTable";
import AddPrescription from "../views/Appointments/AddPrescription";
import PrivateRoute from "./privateRoutes";
import Invoice from "../views/Invoice/Invoice";
import MessageBroadcasting from "../views/Broadcasting/MessageBroadcasting";
import FileUpload from "../views/uploadFile/page";
import Users from "../views/Users/user";
import SupportForm from "../views/Support/SupportForm";
import ForgotPassword from "../views/Login/ForgotPassword";

const Login = lazy(() => import("../views/Login/Login"));
const Error = lazy(() => import("../views/Error"));

const AppRoutes = () => {
  const authenticatedUser = useSelector((state) => state.LoginSlice.authenticated);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/forget-password" element={<ForgotPassword />} />
        <Route exact path="/FileUpload" element={<FileUpload />} />
        <Route
          exact
          path="/messageBroadcasting"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <MessageBroadcasting />
            </PrivateRoute>
          }
        />
        <Route exact path="/docupload" element={<FileUpload />} />

        {/* Protected Routes */}
        <Route
          exact
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/inventory"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <MedicineTable />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/support"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <SupportForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <Patients />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients/:patientId"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <PatientAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <Doctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <Appointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/prescription/:appointmentId"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <AddPrescription />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoice"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <Invoice />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser} >
              <Users />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </Suspense>
  );
};

export default AppRoutes;
