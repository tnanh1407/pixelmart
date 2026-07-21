import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const cartSchema = new mongoose.Schema({
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
    productId: {
        type: String,
        ref: "Product",
        required: [true, "San pham la bat buoc"],
        index: true,
    },
    quantity: {
        type: Number,
        required: [true, "So luong la bat buoc"],
        min: [1, "So luong toi thieu la 1"],
        default: 1,
    },
    selected: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
