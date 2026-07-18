import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICart {
  userId: string;
  productId: string;
  storeId: string;
  quantity: number;
  selected: boolean;
}

export interface ICartDocument extends ICart, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new mongoose.Schema<ICartDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    userId: {
      type: String,
      ref: "User",
      required: [true, "Người dùng là bắt buộc"],
      index: true,
    },

    productId: {
      type: String,
      ref: "Product",
      required: [true, "Sản phẩm là bắt buộc"],
      index: true,
    },

    storeId: {
      type: String,
      ref: "Store",
      required: [true, "Cửa hàng là bắt buộc"],
      index: true,
    },

    quantity: {
      type: Number,
      required: [true, "Số lượng là bắt buộc"],
      min: [1, "Số lượng tối thiểu là 1"],
      default: 1,
    },

    selected: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mỗi user chỉ có 1 cart item cho mỗi product
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Cart = mongoose.model<ICartDocument>("Cart", cartSchema);

export default Cart;
