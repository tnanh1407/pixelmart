import { Router } from "express";
import momoController from "../../controllers/momo.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";

const router = Router();

// Tạo thanh toán MoMo
router.post("/create-payment", asyncHandler(momoController.createPayment.bind(momoController)));

// Mock payment page (MoMo sandbox giả lập) - synchronous, no asyncHandler
router.get("/mock-pay", momoController.mockPayPage.bind(momoController));

// IPN callback từ MoMo (Instant Payment Notification)
router.post("/ipn", asyncHandler(momoController.ipnCallback.bind(momoController)));

// Kiểm tra trạng thái thanh toán
router.get("/check-status", asyncHandler(momoController.checkStatus.bind(momoController)));

export default router;
