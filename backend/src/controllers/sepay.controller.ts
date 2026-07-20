import { Request, Response } from "express";
import sepayService from "../services/sepay.service.js";
import { AppError } from "../middlewares/error.middleware.js";

class SepayController {
  async createPayment(req: Request, res: Response) {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError("Thieu orderId", 400);
    }

    const result = await sepayService.createPayment(orderId);
    res.json({ success: true, data: result });
  }

  async webhook(req: Request, res: Response) {
    const payload = req.body;
    await sepayService.processWebhook(payload);
    res.status(200).json({ success: true });
  }

  async checkStatus(req: Request, res: Response) {
    const { orderId } = req.query;
    if (!orderId) {
      throw new AppError("Thieu orderId", 400);
    }
    const result = await sepayService.checkPaymentStatus(orderId as string);
    res.json({ success: true, data: result });
  }
}

export default new SepayController();
