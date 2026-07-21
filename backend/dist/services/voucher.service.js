import Voucher from "../models/voucher.model.js";
import { AppError } from "../middlewares/error.middleware.js";
class VoucherService {
    async getVouchers(query = {}) {
        const { page = 1, limit = 10, scope, storeId, status } = query;
        const filter = { isActive: true };
        if (scope)
            filter.scope = scope;
        if (storeId)
            filter.storeId = storeId;
        if (status)
            filter.status = status;
        const skipIndex = (Number(page) - 1) * Number(limit);
        const vouchers = await Voucher.find(filter)
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(Number(limit))
            .populate("storeId", "name slug logo");
        const total = await Voucher.countDocuments(filter);
        return {
            vouchers,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async getAvailableVouchers(storeId, orderValue) {
        const now = new Date();
        const filter = {
            isActive: true,
            status: "active",
            startDate: { $lte: now },
            endDate: { $gte: now },
            $expr: { $lt: ["$usedCount", "$usageLimit"] },
        };
        // Platform vouchers + store-specific vouchers
        if (storeId) {
            filter.$or = [
                { scope: "platform" },
                { scope: "store", storeId },
            ];
        }
        else {
            filter.scope = "platform";
        }
        if (orderValue !== undefined) {
            filter.minOrderValue = { $lte: orderValue };
        }
        return await Voucher.find(filter).sort({ value: -1 });
    }
    async getVoucherById(id) {
        const voucher = await Voucher.findById(id).populate("storeId", "name slug logo");
        if (!voucher) {
            throw new AppError("Voucher không tồn tại", 404);
        }
        return voucher;
    }
    async getVoucherByCode(code) {
        const voucher = await Voucher.findOne({
            code: code.toUpperCase(),
            isActive: true,
        }).populate("storeId", "name slug logo");
        if (!voucher) {
            throw new AppError("Voucher không tồn tại hoặc đã hết hạn", 404);
        }
        return voucher;
    }
    async validateVoucher(code, orderValue, storeId) {
        const voucher = await this.getVoucherByCode(code);
        const now = new Date();
        if (voucher.status !== "active") {
            throw new AppError("Voucher không còn hiệu lực", 400);
        }
        if (voucher.startDate > now) {
            throw new AppError("Voucher chưa đến thời gian áp dụng", 400);
        }
        if (voucher.endDate < now) {
            throw new AppError("Voucher đã hết hạn", 400);
        }
        if (voucher.usedCount >= voucher.usageLimit) {
            throw new AppError("Voucher đã hết lượt sử dụng", 400);
        }
        if (orderValue < voucher.minOrderValue) {
            throw new AppError(`Giá trị đơn hàng tối thiểu để áp dụng voucher là ${voucher.minOrderValue.toLocaleString("vi-VN")}đ`, 400);
        }
        if (voucher.scope === "store" && storeId && voucher.storeId !== storeId) {
            throw new AppError("Voucher này không áp dụng cho cửa hàng này", 400);
        }
        let discountAmount = 0;
        if (voucher.type === "percentage") {
            discountAmount = Math.round((orderValue * voucher.value) / 100);
            if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
                discountAmount = voucher.maxDiscount;
            }
        }
        else {
            discountAmount = voucher.value;
        }
        return { voucher, discountAmount };
    }
    async applyVoucher(voucherId) {
        const voucher = await Voucher.findById(voucherId);
        if (!voucher) {
            throw new AppError("Voucher không tồn tại", 404);
        }
        if (voucher.usedCount >= voucher.usageLimit) {
            throw new AppError("Voucher đã hết lượt sử dụng", 400);
        }
        voucher.usedCount += 1;
        if (voucher.usedCount >= voucher.usageLimit) {
            voucher.status = "expired";
        }
        await voucher.save();
        return voucher;
    }
    async createVoucher(data) {
        const { code } = data;
        if (!code) {
            throw new AppError("Mã voucher là bắt buộc", 400);
        }
        const existing = await Voucher.findOne({ code: code.toUpperCase() });
        if (existing) {
            throw new AppError("Mã voucher đã tồn tại", 400);
        }
        return await Voucher.create({
            ...data,
            code: code.toUpperCase(),
        });
    }
    async updateVoucher(id, data) {
        const voucher = await this.getVoucherById(id);
        if (data.name !== undefined)
            voucher.name = data.name;
        if (data.description !== undefined)
            voucher.description = data.description;
        if (data.value !== undefined)
            voucher.value = data.value;
        if (data.minOrderValue !== undefined)
            voucher.minOrderValue = data.minOrderValue;
        if (data.maxDiscount !== undefined)
            voucher.maxDiscount = data.maxDiscount;
        if (data.usageLimit !== undefined)
            voucher.usageLimit = data.usageLimit;
        if (data.startDate !== undefined)
            voucher.startDate = data.startDate;
        if (data.endDate !== undefined)
            voucher.endDate = data.endDate;
        if (data.isActive !== undefined)
            voucher.isActive = data.isActive;
        if (data.status !== undefined)
            voucher.status = data.status;
        return await voucher.save();
    }
    async deleteVoucher(id) {
        const voucher = await this.getVoucherById(id);
        voucher.isActive = false;
        voucher.status = "disabled";
        await voucher.save();
        return { message: "Đã vô hiệu hóa voucher" };
    }
}
export default new VoucherService();
