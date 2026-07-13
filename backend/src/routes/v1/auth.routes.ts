import { Router } from "express";
import authController from "../../controllers/auth.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", asyncHandler(authController.register.bind(authController)));
router.post("/login", asyncHandler(authController.login.bind(authController)));
router.post("/google", asyncHandler(authController.googleLogin.bind(authController)));
router.post("/refresh", asyncHandler(authController.refreshToken.bind(authController)));
router.post("/logout", asyncHandler(authController.logout.bind(authController)));
router.get("/me", auth, asyncHandler(authController.getMe.bind(authController)));

router.post("/send-verification", auth, asyncHandler(authController.sendVerificationCode.bind(authController)));
router.post("/verify-email", auth, asyncHandler(authController.verifyEmail.bind(authController)));
router.post("/resend-verification", auth, asyncHandler(authController.resendVerificationCode.bind(authController)));

router.post("/forgot-password", asyncHandler(authController.forgotPassword.bind(authController)));
router.post("/reset-password", asyncHandler(authController.resetPassword.bind(authController)));

export default router;
