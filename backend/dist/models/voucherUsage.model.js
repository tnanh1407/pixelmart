import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const voucherUsageSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    voucherId: {
        type: String,
        ref: "Voucher",
        required: true,
        index: true,
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
        index: true,
    },
    orderId: {
        type: String,
        ref: "Order",
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
voucherUsageSchema.index({ voucherId: 1, userId: 1 }, { unique: true });
const VoucherUsage = mongoose.model("VoucherUsage", voucherUsageSchema);
export default VoucherUsage;
