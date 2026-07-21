import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Voucher from "../models/voucher.model.js";
import { AppError } from "../middlewares/error.middleware.js";
class OrderService {
    async getOrders(query = {}) {
        const { page = 1, limit = 10, status, userId, storeId } = query;
        const filter = {};
        if (status)
            filter.status = status;
        if (userId)
            filter.userId = userId;
        if (storeId)
            filter.storeId = storeId;
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
    async getOrderById(id) {
        const order = await Order.findById(id)
            .populate("userId", "name email phone")
            .populate("storeId", "name slug logo phone");
        if (!order) {
            throw new AppError("Don hang khong ton tai", 404);
        }
        return order;
    }
    async getOrderByCode(orderCode) {
        const order = await Order.findOne({ orderCode })
            .populate("userId", "name email phone")
            .populate("storeId", "name slug logo phone");
        if (!order) {
            throw new AppError("Don hang khong ton tai", 404);
        }
        return order;
    }
    async getUserOrders(userId, query = {}) {
        return this.getOrders({ ...query, userId });
    }
    async getStoreOrders(storeId, query = {}) {
        return this.getOrders({ ...query, storeId });
    }
    generateOrderCode() {
        const now = new Date();
        const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `DH${datePart}${randomPart}`;
    }
    async checkout(userId, data) {
        const { receiverName, receiverPhone, provinceName, districtName, wardName, streetAddress, voucherCode, paymentMethod, noteOrder } = data;
        const cartItems = await Cart.find({ userId, selected: true })
            .populate({
            path: "productId",
            match: { isDeleted: false, status: "published" },
            populate: { path: "storeId", select: "name slug" },
        })
            .sort({ createdAt: -1 });
        const validItems = cartItems.filter((item) => item.productId);
        if (validItems.length === 0) {
            throw new AppError("Khong co san pham nao duoc chon de thanh toan", 400);
        }
        const storeGroups = {};
        for (const cartItem of validItems) {
            const product = cartItem.productId;
            const sid = product.storeId._id || product.storeId;
            if (!storeGroups[sid]) {
                storeGroups[sid] = {
                    store: product.storeId,
                    items: [],
                    subtotal: 0,
                };
            }
            const effectivePrice = product.discountPrice || product.price;
            const itemSubtotal = effectivePrice * cartItem.quantity;
            storeGroups[sid].items.push({
                productId: product._id,
                productName: product.name,
                productImage: Array.isArray(product.images) ? product.images[0] || "" : "",
                productSlug: product.slug,
                storeId: sid,
                storeName: product.storeId?.name || "",
                price: product.price,
                discountPrice: product.discountPrice || null,
                quantity: cartItem.quantity,
                subtotal: itemSubtotal,
            });
            storeGroups[sid].subtotal += itemSubtotal;
        }
        const createdOrders = [];
        for (const [sid, group] of Object.entries(storeGroups)) {
            const shippingFee = this.calculateShippingFee(group.subtotal);
            let discountAmount = 0;
            let appliedVoucher = null;
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
                        if (voucher.scope === "platform" || (voucher.scope === "store" && voucher.storeId === sid)) {
                            if (group.subtotal >= voucher.minOrderValue) {
                                if (voucher.type === "percentage") {
                                    discountAmount = Math.round((group.subtotal * voucher.value) / 100);
                                    if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
                                        discountAmount = voucher.maxDiscount;
                                    }
                                }
                                else {
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
                }
                catch (err) {
                }
            }
            const totalAmount = group.subtotal - discountAmount + shippingFee;
            const order = await Order.create({
                userId,
                storeId: sid,
                orderCode: this.generateOrderCode(),
                status: "pending",
                items: group.items,
                receiverName: receiverName || undefined,
                receiverPhone: receiverPhone || undefined,
                provinceName: provinceName || undefined,
                districtName: districtName || undefined,
                wardName: wardName || undefined,
                streetAddress: streetAddress || undefined,
                shippingFee,
                subtotal: group.subtotal,
                discountAmount,
                totalAmount: Math.max(totalAmount, 0),
                voucherId: appliedVoucher?._id || null,
                voucherCode: appliedVoucher?.code || null,
                paymentMethod: paymentMethod,
                paymentStatus: "pending",
                noteOrder: noteOrder || "",
            });
            createdOrders.push(order);
        }
        const cartItemIds = validItems.map((item) => item._id);
        await Cart.deleteMany({ _id: { $in: cartItemIds } });
        return createdOrders;
    }
    async updateOrderStatus(id, data) {
        const order = await this.getOrderById(id);
        const { status, cancelReason } = data;
        const validTransitions = {
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
            throw new AppError(`Khong the chuyen trang thai tu "${order.status}" sang "${status}"`, 400);
        }
        if (status === "cancelled") {
            order.cancelReason = cancelReason || "Khong co ly do";
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity },
                });
            }
            if (order.paymentStatus === "paid") {
                order.paymentStatus = "refunded";
            }
        }
        order.status = status;
        await order.save();
        return order;
    }
    async updatePaymentStatus(id, data) {
        const order = await this.getOrderById(id);
        const { paymentStatus, transactionId } = data;
        order.paymentStatus = paymentStatus;
        if (transactionId) {
            order.transactionId = transactionId;
        }
        await order.save();
        return order;
    }
    async cancelOrder(userId, id, reason) {
        const order = await Order.findOne({ _id: id, userId });
        if (!order) {
            throw new AppError("Don hang khong ton tai hoac khong thuoc ve ban", 404);
        }
        if (!["pending", "confirmed"].includes(order.status)) {
            throw new AppError("Chi co the huy don hang o trang thai cho xac nhan hoac da xac nhan", 400);
        }
        return this.updateOrderStatus(id, { status: "cancelled", cancelReason: reason });
    }
    calculateShippingFee(subtotal) {
        if (subtotal >= 500000)
            return 0;
        if (subtotal >= 200000)
            return 15000;
        return 30000;
    }
}
export default new OrderService();
