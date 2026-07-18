import Cart, { ICart } from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class CartService {
  async getCart(userId: string) {
    const items = await Cart.find({ userId })
      .populate({
        path: "productId",
        match: { isDeleted: false, status: "published" },
        select: "name slug price discountPrice stock images storeId",
        populate: { path: "storeId", select: "name slug logo" },
      })
      .sort({ createdAt: -1 });

    // Filter out null populated products (deleted/archived)
    const validItems = items.filter((item) => item.productId);

    // Group by store
    const grouped: Record<string, { store: any; items: any[] }> = {};
    for (const item of validItems) {
      const product = item.productId as any;
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

  async getCartItemCount(userId: string) {
    const result = await Cart.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "products",
          let: { productId: { $toObjectId: "$productId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$productId"] }, isDeleted: false, status: "published" } },
            { $limit: 1 },
          ],
          as: "product",
        },
      },
      { $match: { "product.0": { $exists: true } } },
      { $count: "count" },
    ]);

    // Fallback for string _id (not ObjectId)
    const count = await Cart.countDocuments({ userId });
    return { count };
  }

  async addToCart(userId: string, data: { productId: string; quantity?: number }) {
    const { productId, quantity = 1 } = data;

    const product = await Product.findById(productId);
    if (!product || product.isDeleted || product.status !== "published") {
      throw new AppError("Sản phẩm không tồn tại hoặc đã bị gỡ xuống", 404);
    }

    if (product.stock < quantity) {
      throw new AppError("Số lượng sản phẩm trong kho không đủ", 400);
    }

    const existing = await Cart.findOne({ userId, productId });
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new AppError(`Số lượng trong giỏ hàng (${existing.quantity}) + thêm (${quantity}) vượt quá tồn kho (${product.stock})`, 400);
      }
      existing.quantity = newQuantity;
      existing.selected = true;
      return await existing.save();
    }

    return await Cart.create({ userId, productId, storeId: product.storeId, quantity });
  }

  async updateCartItem(userId: string, cartItemId: string, data: { quantity?: number; selected?: boolean }) {
    const item = await Cart.findOne({ _id: cartItemId, userId });
    if (!item) {
      throw new AppError("Sản phẩm không có trong giỏ hàng", 404);
    }

    if (data.quantity !== undefined) {
      if (data.quantity < 1) {
        throw new AppError("Số lượng tối thiểu là 1", 400);
      }

      const product = await Product.findById(item.productId);
      if (product && data.quantity > product.stock) {
        throw new AppError(`Số lượng vượt quá tồn kho (${product.stock})`, 400);
      }
      item.quantity = data.quantity;
    }

    if (data.selected !== undefined) {
      item.selected = data.selected;
    }

    return await item.save();
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const item = await Cart.findOneAndDelete({ _id: cartItemId, userId });
    if (!item) {
      throw new AppError("Sản phẩm không có trong giỏ hàng", 404);
    }
    return { message: "Đã xóa sản phẩm khỏi giỏ hàng" };
  }

  async clearCart(userId: string) {
    await Cart.deleteMany({ userId });
    return { message: "Đã xóa toàn bộ giỏ hàng" };
  }

  async selectAllItems(userId: string, selected: boolean) {
    await Cart.updateMany({ userId }, { selected });
    return { message: selected ? "Đã chọn tất cả" : "Đã bỏ chọn tất cả" };
  }

  async getSelectedItems(userId: string) {
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
