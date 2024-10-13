import express from "express";
import admin from "../controllers/adminController.js";
import {
  adminLoginValidations,
  adminRegisterValidations,
  changePasswordValidation,
} from "../middlewares/validation/admin.js";
import { adminAuth } from "../middlewares/validation/auth.js";

const router = express.Router();
const adminController = new admin();

router.post("/login", [adminLoginValidations], adminController.login);
router.get("/getAllUsers", [adminAuth], adminController.userList);
router.get("/getDetails", [adminAuth], adminController.getUserDetails);
router.patch(
  "/changePassword",
  [changePasswordValidation, adminAuth],
  adminController.changePassword,
);
router.get(
  "/getAllPermissions",
  [adminAuth],
  adminController.getAllPermissions,
);
router.get(
  "/getPermissions/:userid",
  [adminAuth],
  adminController.getPermissions,
);
router.patch(
  "/updatepermissions/:userid",
  [adminAuth],
  adminController.updatePermissions,
);
router.post(
  "/register",
  [adminAuth, adminRegisterValidations],
  adminController.register,
);
router.post("/onboardDoctor", [adminAuth], adminController.onboardDoctor);
router.get('/doctors', [adminAuth], adminController.getDoctors);
router.post('/forgot-password',  adminController.forgotPassword);
router.patch('/reset-password/:id', adminController.resetPassword);
export default router;
