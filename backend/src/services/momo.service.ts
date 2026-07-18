import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { MOMO_CONFIG, MOMO_RESPONSE_CODE, MomoCreatePaymentRequest, MomoCreatePaymentResponse, MomoIPNRequest } from "../config/momo.js";
import { createMomoSignature } from "../utils/momoSignature.js";
import Order from "../models/order.model.js";
import PaymentTransaction from "../models/paymentTransaction.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class MomoService {
  async createPayment(data: MomoCreatePaymentRequest): Promise<MomoCreatePaymentResponse> {
    const { amount, orderId, orderInfo, extraData = "" } = data;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }
    if (order.paymentStatus === "paid") {
      throw new AppError("Đơn hàng đã được thanh toán", 400);
    }
    if (order.paymentMethod !== "e_wallet") {
      throw new AppError("Phương thức thanh toán không phải ví điện tử", 400);
    }

    const requestId = uuidv4();

    // Build raw signature data (MoMo format)
    const rawSignature = `accessKey=${MOMO_CONFIG.ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.IPN_URL}&orderId=${orderId}&orderInfo=${encodeURIComponent(orderInfo)}&partnerCode=${MOMO_CONFIG.PARTNER_CODE}&redirectUrl=${MOMO_CONFIG.REDIRECT_URL}&requestId=${requestId}&requestType=${MOMO_CONFIG.REQUEST_TYPE}`;

    const signature = createMomoSignature(
      {
        accessKey: MOMO_CONFIG.ACCESS_KEY,
        amount,
        extraData,
        ipnUrl: MOMO_CONFIG.IPN_URL,
        orderId,
        orderInfo: encodeURIComponent(orderInfo),
        partnerCode: MOMO_CONFIG.PARTNER_CODE,
        redirectUrl: MOMO_CONFIG.REDIRECT_URL,
        requestId,
        requestType: MOMO_CONFIG.REQUEST_TYPE,
      },
      MOMO_CONFIG.SECRET_KEY
    );

    // MOCK: Generate a mock payUrl (in production, call MoMo API)
    const payUrl = this.generateMockPayUrl(requestId, orderId, amount);

    // Create payment transaction
    await PaymentTransaction.create({
      orderId,
      userId: order.userId,
      amount,
      method: "e_wallet",
      type: "payment",
      gateway: "momo",
      gatewayTransactionId: requestId,
      status: "pending",
      gatewayResponse: {
        requestId,
        payUrl,
        signature,
      },
    });

    return {
      partnerCode: MOMO_CONFIG.PARTNER_CODE,
      requestId,
      orderId,
      amount,
      responseTime: Date.now(),
      message: "Thành công (Mock)",
      resultCode: 0,
      payUrl,
      deeplink: payUrl,
      qrCodeUrl: "",
    };
  }

  async processIPN(data: MomoIPNRequest): Promise<void> {
    const { orderId, requestId, resultCode, transId, amount } = data;

    // Verify signature (mock - always pass in dev)
    // In production: verifyHMAC(data, MOMO_CONFIG.SECRET_KEY)

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }

    const transaction = await PaymentTransaction.findOne({
      gatewayTransactionId: requestId,
      orderId,
    });

    if (!transaction) {
      throw new AppError("Giao dịch không tồn tại", 404);
    }

    // Map MoMo resultCode to transaction status
    let status: string;
    switch (resultCode) {
      case MOMO_RESPONSE_CODE.SUCCESS:
        status = "success";
        break;
      case MOMO_RESPONSE_CODE.USER_CANCELLED:
        status = "failed";
        break;
      default:
        status = "failed";
    }

    // Update transaction
    transaction.status = status as any;
    transaction.gatewayTransactionId = transId.toString();
    transaction.gatewayResponse = {
      ...(transaction.gatewayResponse || {}),
      ipnResult: { resultCode, message: data.message, transId, responseTime: data.responseTime },
    };
    await transaction.save();

    // Update order payment status
    if (resultCode === MOMO_RESPONSE_CODE.SUCCESS) {
      order.paymentStatus = "paid";
      await order.save();
    } else if (resultCode === MOMO_RESPONSE_CODE.USER_CANCELLED) {
      order.paymentStatus = "failed";
      await order.save();
    }
  }

  async checkPaymentStatus(orderId: string, requestId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }

    return {
      orderId,
      requestId,
      amount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
    };
  }

  // MOCK: Generate a mock payment page URL
  private generateMockPayUrl(requestId: string, orderId: string, amount: number): string {
    const baseUrl = "http://localhost:5000/api/v1/payment/momo/mock-pay";

    // Auto-success for testing (in production, this would be MoMo's real URL)
    const params = new URLSearchParams({
      requestId,
      orderId,
      amount: amount.toString(),
    });

    return `${baseUrl}?${params.toString()}`;
  }
}

export default new MomoService();
