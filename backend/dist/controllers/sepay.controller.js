import sepayService from "../services/sepay.service.js";
import { AppError } from "../middlewares/error.middleware.js";
class SepayController {
    async createPayment(req, res) {
        const { orderId } = req.body;
        if (!orderId) {
            throw new AppError("Thieu orderId", 400);
        }
        const result = await sepayService.createPayment(orderId);
        res.json({ success: true, data: result });
    }
    async webhook(req, res) {
        const payload = req.body;
        await sepayService.processWebhook(payload);
        res.status(200).json({ success: true });
    }
    async checkStatus(req, res) {
        const { orderId } = req.query;
        if (!orderId) {
            throw new AppError("Thieu orderId", 400);
        }
        const result = await sepayService.checkPaymentStatus(orderId);
        res.json({ success: true, data: result });
    }
}
export default new SepayController();
