import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const flashSaleItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    flashSaleId: {
        type: String,
        ref: "FlashSale",
        required: [true, "Mã Flash Sale là bắt buộc"],
        index: true,
    },
    productId: {
        type: String,
        ref: "Product",
        required: [true, "Mã sản phẩm là bắt buộc"],
        index: true,
    },
    flashPrice: {
        type: Number,
        required: [true, "Giá Flash Sale là bắt buộc"],
        min: [0, "Giá Flash Sale không được âm"],
    },
    flashStock: {
        type: Number,
        required: [true, "Số lượng hàng Flash Sale là bắt buộc"],
        min: [0, "Số lượng hàng không được âm"],
    },
    flashSold: {
        type: Number,
        default: 0,
        min: [0, "Số lượng đã bán không được âm"],
    },
}, {
    timestamps: true,
});
flashSaleItemSchema.index({ flashSaleId: 1, productId: 1 }, { unique: true });
const FlashSaleItem = mongoose.model("FlashSaleItem", flashSaleItemSchema);
export default FlashSaleItem;
