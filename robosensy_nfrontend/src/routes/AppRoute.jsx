//Main Route

import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dashboard, Auth } from "@/layouts";
import Homepage from "../views/Homepage/v2/Homepage";
import ForgotPassword from "@/views/Login/ForgotPassword";
import FileUpload from "@/views/UploadDoc/Page";
import PrivateRoute from "./privateRoutes";
import AddPrescription from "@/views/Appointments/AddPrescription";

const Login = lazy(() => import("../views/Login/Login"));
const Error = lazy(() => import("../views/Error"));

function App() {
    const authenticatedUser = useSelector((state) => state.LoginSlice.authenticated);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/forget-password" element={<ForgotPassword />} />
        <Route exact path="/FileUpload" element={<FileUpload />} />

        <Route path="/dashboard/*" 
            element={
                <PrivateRoute isAuthenticated={authenticatedUser}>
                    <Dashboard />
                </PrivateRoute>
                
            } 
        />
        <Route 
          exact
          path="/dashboard/appointment/prescription/:appointmentId"
          element={
            <PrivateRoute isAuthenticated={authenticatedUser}>
              <AddPrescription />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
}

export default App;
