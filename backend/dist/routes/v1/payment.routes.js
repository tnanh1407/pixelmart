import { Router } from "express";
import sepayController from "../../controllers/sepay.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
const router = Router();
router.post("/create-payment", asyncHandler(sepayController.createPayment.bind(sepayController)));
router.post("/webhook", asyncHandler(sepayController.webhook.bind(sepayController)));
router.get("/check-status", asyncHandler(sepayController.checkStatus.bind(sepayController)));
export default router;
