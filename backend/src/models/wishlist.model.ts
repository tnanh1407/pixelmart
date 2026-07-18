import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IWishlist {
  userId: string;
  productId: string;
}

export interface IWishlistDocument extends IWishlist, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new mongoose.Schema<IWishlistDocument>(
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
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

wishlistSchema.post("save", async function () {
  const Product = mongoose.model("Product");
  await Product.findByIdAndUpdate(this.productId, { $inc: { wishlistCount: 1 } });
});

wishlistSchema.post("deleteOne", { document: true, query: false }, async function () {
  const Product = mongoose.model("Product");
  await Product.findByIdAndUpdate(this.productId, { $inc: { wishlistCount: -1 } });
});

const Wishlist = mongoose.model<IWishlistDocument>("Wishlist", wishlistSchema);

export default Wishlist;
