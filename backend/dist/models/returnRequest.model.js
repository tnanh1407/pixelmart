import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
export const RETURN_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    SHIPPED: "shipped",
    RECEIVED: "received",
    REFUNDED: "refunded",
    CANCELLED: "cancelled",
};
const timelineEntrySchema = new mongoose.Schema({
    status: { type: String, required: true },
    note: { type: String, default: "" },
    changedBy: { type: String, default: null },
    changedAt: { type: Date, default: Date.now },
}, { _id: false });
const returnRequestSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    orderId: {
        type: String,
        ref: "Order",
        required: [true, "Đơn hàng là bắt buộc"],
        index: true,
    },
    userId: {
        type: String,
        ref: "User",
        required: [true, "Người dùng là bắt buộc"],
        index: true,
    },
    storeId: {
        type: String,
        ref: "Store",
        required: [true, "Cửa hàng là bắt buộc"],
        index: true,
    },
    reason: {
        type: String,
        required: [true, "Lý do trả hàng là bắt buộc"],
        trim: true,
        maxlength: [500, "Lý do tối đa 500 ký tự"],
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        enum: Object.values(RETURN_STATUS),
        default: RETURN_STATUS.PENDING,
        index: true,
    },
    refundAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    rejectedReason: {
        type: String,
        default: null,
    },
    approvedBy: {
        type: String,
        ref: "User",
        default: null,
    },
    timeline: {
        type: [timelineEntrySchema],
        default: [],
    },
}, {
    timestamps: true,
});
returnRequestSchema.index({ userId: 1, status: 1, createdAt: -1 });
returnRequestSchema.index({ storeId: 1, status: 1, createdAt: -1 });
const ReturnRequest = mongoose.model("ReturnRequest", returnRequestSchema);
export default ReturnRequest;
