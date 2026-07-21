import Order from "../models/order.model.js";
import PaymentTransaction from "../models/paymentTransaction.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { SEPAY_CONFIG } from "../config/sepay.js";
class SepayService {
    generateQRUrl(amount, description) {
        const acc = encodeURIComponent(SEPAY_CONFIG.BANK_ACCOUNT);
        const bank = encodeURIComponent(SEPAY_CONFIG.BANK_NAME);
        const amountStr = encodeURIComponent(amount.toString());
        const des = encodeURIComponent(description.replace(/\s+/g, " ").trim());
        return `https://vietqr.app/img?acc=${acc}&bank=${bank}&amount=${amountStr}&des=${des}&template=compact`;
    }
    async createPayment(orderId) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new AppError("Don hang khong ton tai", 404);
        }
        if (order.paymentStatus === "paid") {
            throw new AppError("Don hang da duoc thanh toan", 400);
        }
        if (order.paymentMethod !== "bank_transfer") {
            throw new AppError("Phuong thuc thanh toan khong phai chuyen khoan", 400);
        }
        const description = `TT ${order.orderCode}`;
        const qrCodeUrl = this.generateQRUrl(order.totalAmount, description);
        await PaymentTransaction.create({
            orderId,
            userId: order.userId,
            amount: order.totalAmount,
            method: "bank_transfer",
            type: "payment",
            gateway: "sepay",
            status: "pending",
            gatewayResponse: { qrCodeUrl, orderCode: order.orderCode },
        });
        return { qrCodeUrl };
    }
    async processWebhook(payload) {
        const { id, transferAmount, content, referenceCode, transferType } = payload;
        if (transferType !== "in") {
            return { success: true };
        }
        const existing = await PaymentTransaction.findOne({
            "gatewayResponse.sepayTransactionId": id,
        });
        if (existing) {
            return { success: true };
        }
        const orderCode = this.parseOrderCode(content);
        if (!orderCode) {
            return { success: true };
        }
        const order = await Order.findOne({ orderCode });
        if (!order) {
            return { success: true };
        }
        if (order.paymentStatus === "paid") {
            return { success: true };
        }
        if (order.paymentMethod !== "bank_transfer") {
            return { success: true };
        }
        if (transferAmount < order.totalAmount) {
            return { success: true };
        }
        const transaction = await PaymentTransaction.create({
            orderId: String(order._id),
            userId: order.userId,
            amount: transferAmount,
            method: "bank_transfer",
            type: "payment",
            gateway: "sepay",
            gatewayTransactionId: referenceCode,
            status: "success",
            gatewayResponse: {
                sepayTransactionId: id,
                content,
                referenceCode,
                transactionDate: payload.transactionDate,
                gateway: payload.gateway,
                orderCode,
            },
        });
        order.paymentStatus = "paid";
        order.transactionId = String(transaction._id);
        await order.save();
        return { success: true };
    }
    async checkPaymentStatus(orderId) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new AppError("Don hang khong ton tai", 404);
        }
        return {
            orderId,
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            totalAmount: order.totalAmount,
        };
    }
    parseOrderCode(content) {
        const match = content.match(/TT\s*(DH\d+)/i);
        return match ? match[1] : null;
    }
}
export default new SepayService();
