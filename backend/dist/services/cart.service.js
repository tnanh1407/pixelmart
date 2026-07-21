import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { AppError } from "../middlewares/error.middleware.js";
class CartService {
    async getCart(userId) {
        const items = await Cart.find({ userId })
            .populate({
            path: "productId",
            match: { isDeleted: false, status: "published" },
            select: "name slug price discountPrice stock images storeId",
            populate: { path: "storeId", select: "name slug logo" },
        })
            .sort({ createdAt: -1 });
        const validItems = items.filter((item) => item.productId);
        const grouped = {};
        for (const item of validItems) {
            const product = item.productId;
            const storeId = product.storeId ? (typeof product.storeId === "object" ? product.storeId._id : product.storeId) : "unknown";
            if (!grouped[storeId]) {
                grouped[storeId] = {
                    store: typeof product.storeId === "object" ? product.storeId : { _id: storeId },
                    items: [],
                };
            }
            grouped[storeId].items.push({
                _id: item._id,
                product,
                quantity: item.quantity,
                selected: item.selected,
            });
        }
        return Object.values(grouped);
    }
    async getCartItemCount(userId) {
        const count = await Cart.countDocuments({ userId });
        return { count };
    }
    async addToCart(userId, data) {
        const { productId, quantity = 1 } = data;
        const product = await Product.findById(productId);
        if (!product || product.isDeleted || product.status !== "published") {
            throw new AppError("San pham khong ton tai hoac da bi go xuong", 404);
        }
        if (product.stock < quantity) {
            throw new AppError("So luong san pham trong kho khong du", 400);
        }
        const existing = await Cart.findOne({ userId, productId });
        if (existing) {
            const newQuantity = existing.quantity + quantity;
            if (newQuantity > product.stock) {
                throw new AppError(`So luong trong gio hang (${existing.quantity}) + them (${quantity}) vuot qua ton kho (${product.stock})`, 400);
            }
            existing.quantity = newQuantity;
            existing.selected = true;
            return await existing.save();
        }
        return await Cart.create({ userId, productId, quantity });
    }
    async updateCartItem(userId, cartItemId, data) {
        const item = await Cart.findOne({ _id: cartItemId, userId });
        if (!item) {
            throw new AppError("San pham khong co trong gio hang", 404);
        }
        if (data.quantity !== undefined) {
            if (data.quantity < 1) {
                throw new AppError("So luong toi thieu la 1", 400);
            }
            const product = await Product.findById(item.productId);
            if (product && data.quantity > product.stock) {
                throw new AppError(`So luong vuot qua ton kho (${product.stock})`, 400);
            }
            item.quantity = data.quantity;
        }
        if (data.selected !== undefined) {
            item.selected = data.selected;
        }
        return await item.save();
    }
    async removeFromCart(userId, cartItemId) {
        const item = await Cart.findOneAndDelete({ _id: cartItemId, userId });
        if (!item) {
            throw new AppError("San pham khong co trong gio hang", 404);
        }
        return { message: "Da xoa san pham khoi gio hang" };
    }
    async clearCart(userId) {
        await Cart.deleteMany({ userId });
        return { message: "Da xoa toan bo gio hang" };
    }
    async selectAllItems(userId, selected) {
        await Cart.updateMany({ userId }, { selected });
        return { message: selected ? "Da chon tat ca" : "Da bo chon tat ca" };
    }
    async getSelectedItems(userId) {
        const items = await Cart.find({ userId, selected: true })
            .populate({
            path: "productId",
            match: { isDeleted: false, status: "published" },
            select: "name slug price discountPrice stock images storeId",
        })
            .sort({ createdAt: -1 });
        return items.filter((item) => item.productId);
    }
}
export default new CartService();
