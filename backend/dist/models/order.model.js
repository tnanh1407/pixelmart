import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPING: "shipping",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    RETURNED: "returned",
};
export const PAYMENT_METHOD = {
    COD: "cod",
    BANK_TRANSFER: "bank_transfer",
    E_WALLET: "e_wallet",
};
export const PAYMENT_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    REFUNDED: "refunded",
    FAILED: "failed",
};
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        ref: "Product",
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
        default: "",
    },
    productSlug: {
        type: String,
        default: "",
    },
    storeId: {
        type: String,
        ref: "Store",
        required: true,
    },
    storeName: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discountPrice: {
        type: Number,
        default: null,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });
const orderSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    userId: {
        type: String,
        ref: "User",
        required: [true, "Nguoi dung la bat buoc"],
        index: true,
    },
    storeId: {
        type: String,
        ref: "Store",
        required: [true, "Cua hang la bat buoc"],
        index: true,
    },
    orderCode: {
        type: String,
        required: [true, "Ma don hang la bat buoc"],
        unique: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.PENDING,
        index: true,
    },
    items: {
        type: [orderItemSchema],
        required: [true, "Danh sach san pham la bat buoc"],
    },
    receiverName: {
        type: String,
        default: null,
    },
    receiverPhone: {
        type: String,
        default: null,
    },
    provinceName: {
        type: String,
        default: null,
    },
    districtName: {
        type: String,
        default: null,
    },
    wardName: {
        type: String,
        default: null,
    },
    streetAddress: {
        type: String,
        default: null,
    },
    shippingFee: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    voucherId: {
        type: String,
        ref: "Voucher",
        default: null,
    },
    voucherCode: {
        type: String,
        default: null,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PAYMENT_METHOD),
        default: PAYMENT_METHOD.COD,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING,
        index: true,
    },
    transactionId: {
        type: String,
        default: null,
        index: true,
    },
    noteOrder: {
        type: String,
        trim: true,
        default: "",
    },
    cancelReason: {
        type: String,
        trim: true,
        default: null,
    },
    confirmedAt: {
        type: Date,
        default: null,
    },
    shippedAt: {
        type: Date,
        default: null,
    },
    deliveredAt: {
        type: Date,
        default: null,
    },
    cancelledAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
orderSchema.index({ userId: 1, status: 1, createdAt: -1 });
orderSchema.index({ storeId: 1, status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.pre("save", function () {
    if (this.isModified("status")) {
        if (this.status === "confirmed" && !this.confirmedAt) {
            this.confirmedAt = new Date();
        }
        if (this.status === "shipping" && !this.shippedAt) {
            this.shippedAt = new Date();
        }
        if (this.status === "delivered" && !this.deliveredAt) {
            this.deliveredAt = new Date();
        }
        if (this.status === "cancelled" && !this.cancelledAt) {
            this.cancelledAt = new Date();
        }
        if (this.status === "delivered" && this.paymentMethod === "cod") {
            this.paymentStatus = "paid";
        }
    }
});
const Order = mongoose.model("Order", orderSchema);
export default Order;
