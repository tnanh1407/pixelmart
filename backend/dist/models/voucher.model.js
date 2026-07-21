import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
export const VOUCHER_TYPE = {
    PERCENTAGE: "percentage",
    FIXED: "fixed",
};
export const VOUCHER_SCOPE = {
    PLATFORM: "platform",
    STORE: "store",
};
const voucherSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    code: {
        type: String,
        required: [true, "Mã voucher là bắt buộc"],
        unique: true,
        uppercase: true,
        trim: true,
        minlength: [4, "Mã voucher tối thiểu 4 ký tự"],
        maxlength: [20, "Mã voucher tối đa 20 ký tự"],
    },
    name: {
        type: String,
        required: [true, "Tên voucher là bắt buộc"],
        trim: true,
        maxlength: [200, "Tên voucher tối đa 200 ký tự"],
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    type: {
        type: String,
        enum: Object.values(VOUCHER_TYPE),
        required: [true, "Loại giảm giá là bắt buộc"],
    },
    value: {
        type: Number,
        required: [true, "Giá trị giảm là bắt buộc"],
        min: [0, "Giá trị giảm không được âm"],
    },
    minOrderValue: {
        type: Number,
        required: [true, "Giá trị đơn hàng tối thiểu là bắt buộc"],
        min: [0, "Giá trị đơn hàng tối thiểu không được âm"],
        default: 0,
    },
    maxDiscount: {
        type: Number,
        default: null,
    },
    scope: {
        type: String,
        enum: Object.values(VOUCHER_SCOPE),
        required: [true, "Phạm vi áp dụng là bắt buộc"],
        index: true,
    },
    storeId: {
        type: String,
        ref: "Store",
        default: null,
        index: true,
    },
    usageLimit: {
        type: Number,
        required: [true, "Giới hạn lượt sử dụng là bắt buộc"],
        min: [1, "Giới hạn sử dụng tối thiểu là 1"],
    },
    usedCount: {
        type: Number,
        default: 0,
        min: [0, "Số lượt đã dùng không được âm"],
    },
    startDate: {
        type: Date,
        required: [true, "Ngày bắt đầu là bắt buộc"],
    },
    endDate: {
        type: Date,
        required: [true, "Ngày kết thúc là bắt buộc"],
    },
    status: {
        type: String,
        enum: ["active", "expired", "disabled"],
        default: "active",
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
});
// Validate endDate > startDate
voucherSchema.pre("validate", function () {
    if (this.startDate && this.endDate && this.endDate <= this.startDate) {
        this.invalidate("endDate", "Ngày kết thúc phải sau ngày bắt đầu");
    }
});
// Auto-compute status from dates
voucherSchema.pre("save", function () {
    const now = new Date();
    if (!this.isModified("status") || this.status === "active") {
        if (this.endDate < now) {
            this.status = "expired";
        }
        else if (this.startDate > now) {
            this.status = "active";
        }
    }
});
// Percentage vouchers must have value ≤ 100
voucherSchema.pre("validate", function () {
    if (this.type === "percentage" && this.value > 100) {
        this.invalidate("value", "Giảm giá theo phần trăm không được vượt quá 100%");
    }
});
// Store voucher must have storeId
voucherSchema.pre("validate", function () {
    if (this.scope === "store" && !this.storeId) {
        this.invalidate("storeId", "Voucher cửa hàng phải có storeId");
    }
});
voucherSchema.index({ code: 1, status: 1 });
voucherSchema.index({ scope: 1, status: 1 });
const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;
