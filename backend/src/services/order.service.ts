import Order, { IOrder } from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import Voucher from "../models/voucher.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class OrderService {
  async getOrders(query: any = {}) {
    const { page = 1, limit = 10, status, userId, storeId } = query;
    const filter: any = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (storeId) filter.storeId = storeId;

    const skipIndex = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit))
      .populate("userId", "name email")
      .populate("storeId", "name slug logo");

    const total = await Order.countDocuments(filter);

    return {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getOrderById(id: string) {
    const order = await Order.findById(id)
      .populate("userId", "name email phone")
      .populate("storeId", "name slug logo phone");
    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }
    return order;
  }

  async getOrderByCode(orderCode: string) {
    const order = await Order.findOne({ orderCode })
      .populate("userId", "name email phone")
      .populate("storeId", "name slug logo phone");
    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }
    return order;
  }

  async getUserOrders(userId: string, query: any = {}) {
    return this.getOrders({ ...query, userId });
  }

  async getStoreOrders(storeId: string, query: any = {}) {
    return this.getOrders({ ...query, storeId });
  }

  private generateOrderCode(): string {
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DH${datePart}${randomPart}`;
  }

  async checkout(userId: string, data: {
    shippingAddress: {
      receiverName: string;
      receiverPhone: string;
      provinceName: string;
      districtName: string;
      wardName: string;
      streetAddress: string;
    };
    voucherCode?: string;
    paymentMethod: string;
    note?: string;
  }) {
    const { shippingAddress, voucherCode, paymentMethod, note } = data;

    // Get selected cart items
    const cartItems = await Cart.find({ userId, selected: true })
      .populate({
        path: "productId",
        match: { isDeleted: false, status: "published" },
        populate: { path: "storeId", select: "name slug" },
      })
      .sort({ createdAt: -1 });

    const validItems = cartItems.filter((item) => item.productId);
    if (validItems.length === 0) {
      throw new AppError("Không có sản phẩm nào được chọn để thanh toán", 400);
    }

    // Group items by store
    const storeGroups: Record<string, { store: any; items: any[]; subtotal: number }> = {};
    for (const cartItem of validItems) {
      const product = cartItem.productId as any;
      const storeId = product.storeId._id || product.storeId;

      if (!storeGroups[storeId]) {
        storeGroups[storeId] = {
          store: product.storeId,
          items: [],
          subtotal: 0,
        };
      }

      const effectivePrice = product.discountPrice || product.price;
      const itemSubtotal = effectivePrice * cartItem.quantity;

      storeGroups[storeId].items.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || "",
        productSlug: product.slug,
        storeId,
        storeName: product.storeId?.name || "",
        price: product.price,
        discountPrice: product.discountPrice || null,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });

      storeGroups[storeId].subtotal += itemSubtotal;
    }

    // Create one order per store
    const createdOrders: any[] = [];

    for (const [storeId, group] of Object.entries(storeGroups)) {
      const shippingFee = this.calculateShippingFee(group.subtotal);
      let discountAmount = 0;
      let appliedVoucher: any = null;

      // Validate and apply voucher
      if (voucherCode) {
        try {
          const voucher = await Voucher.findOne({
            code: voucherCode.toUpperCase(),
            isActive: true,
            status: "active",
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
            $expr: { $lt: ["$usedCount", "$usageLimit"] },
          });

          if (voucher) {
            // Check if voucher applies to this store
            if (voucher.scope === "platform" || (voucher.scope === "store" && voucher.storeId === storeId)) {
              if (group.subtotal >= voucher.minOrderValue) {
                if (voucher.type === "percentage") {
                  discountAmount = Math.round((group.subtotal * voucher.value) / 100);
                  if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
                    discountAmount = voucher.maxDiscount;
                  }
                } else {
                  discountAmount = voucher.value;
                }

                voucher.usedCount += 1;
                if (voucher.usedCount >= voucher.usageLimit) {
                  voucher.status = "expired";
                }
                await voucher.save();
                appliedVoucher = voucher;
              }
            }
          }
        } catch (err) {
          // If voucher validation fails, just skip the voucher
        }
      }

      const totalAmount = group.subtotal - discountAmount + shippingFee;

      const order = await Order.create({
        userId,
        storeId,
        orderCode: this.generateOrderCode(),
        status: "pending",
        items: group.items,
        shippingAddress,
        shippingFee,
        subtotal: group.subtotal,
        discountAmount,
        totalAmount: Math.max(totalAmount, 0),
        voucherId: appliedVoucher?._id || null,
        voucherCode: appliedVoucher?.code || null,
        paymentMethod: paymentMethod as any,
        paymentStatus: "pending",
        note: note || "",
      });

      createdOrders.push(order);
    }

    // Clear selected cart items
    const cartItemIds = validItems.map((item) => item._id);
    await Cart.deleteMany({ _id: { $in: cartItemIds } });

    return createdOrders;
  }

  async updateOrderStatus(id: string, data: { status: string; cancelReason?: string }) {
    const order = await this.getOrderById(id);
    const { status, cancelReason } = data;

    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipping", "cancelled"],
      shipping: ["delivered", "cancelled"],
      delivered: ["returned"],
      cancelled: [],
      returned: [],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      throw new AppError(
        `Không thể chuyển trạng thái từ "${order.status}" sang "${status}"`,
        400
      );
    }

    if (status === "cancelled") {
      order.cancelReason = cancelReason || "Không có lý do";
      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
      // Refund payment if paid
      if (order.paymentStatus === "paid") {
        order.paymentStatus = "refunded";
      }
    }

    order.status = status as any;
    await order.save();

    return order;
  }

  async updatePaymentStatus(id: string, data: { paymentStatus: string; transactionId?: string }) {
    const order = await this.getOrderById(id);
    const { paymentStatus, transactionId } = data;

    order.paymentStatus = paymentStatus as any;
    if (transactionId) {
      order.transactionId = transactionId;
    }

    await order.save();
    return order;
  }

  async cancelOrder(userId: string, id: string, reason: string) {
    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      throw new AppError("Đơn hàng không tồn tại hoặc không thuộc về bạn", 404);
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      throw new AppError("Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận hoặc đã xác nhận", 400);
    }

    return this.updateOrderStatus(id, { status: "cancelled", cancelReason: reason });
  }

  private calculateShippingFee(subtotal: number): number {
    if (subtotal >= 500000) return 0;
    if (subtotal >= 200000) return 15000;
    return 30000;
  }
}

export default new OrderService();
