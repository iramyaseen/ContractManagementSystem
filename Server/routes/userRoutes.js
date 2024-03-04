import express from "express";
import {
  userRegistration,
  userLogin,
  sendEmailResetPassword,
  userPasswordReset,
  verifyOtp,
  resendOtp,
  blockUser,
  enableUser,
} from "../controllers/userController.js";
import { authenticateAdmin } from "../middlewares/auth_admin.middleware.js";
import { authenticateUser } from "../middlewares/auth_user.middleware.js";
const router = express.Router();


// Public Routes
router.post("/register", userRegistration);
router.post("/login",authenticateUser, userLogin);
router.post("/forgot-password", sendEmailResetPassword);
router.post("/verify-otp", verifyOtp);
router.patch("/reset-password", userPasswordReset);
router.post("/resend-otp", resendOtp);
router.patch("/block-user/:admin_id/:user_id", authenticateAdmin, blockUser);
router.patch("/enable-user/:admin_id/:user_id", authenticateAdmin, enableUser);


export default router;
