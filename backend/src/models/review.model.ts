import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IReview {
  userId: string;
  productId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  isActive: boolean;
}

export interface IReviewDocument extends IReview, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    userId: {
      type: String,
      ref: "User",
      required: [true, "Người dùng đánh giá là bắt buộc"],
      index: true,
    },
    productId: {
      type: String,
      ref: "Product",
      required: [true, "Sản phẩm được đánh giá là bắt buộc"],
      index: true,
    },
    orderId: {
      type: String,
      ref: "Order",
      default: null,
    },
    rating: {
      type: Number,
      required: [true, "Số sao đánh giá là bắt buộc"],
      min: [1, "Đánh giá tối thiểu là 1 sao"],
      max: [5, "Đánh giá tối đa là 5 sao"],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Tiêu đề tối đa 200 ký tự"],
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      default: [], // Lưu trữ danh sách URL ảnh (Cloudinary)
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục kết hợp để tránh một khách hàng đánh giá trùng lặp nhiều lần cho cùng 1 sản phẩm
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Hàm static tính toán điểm đánh giá trung bình cho Product
reviewSchema.statics.calcAverageRatings = async function (productId: string) {
  const stats = await this.aggregate([
    { $match: { productId, isActive: true } },
    { $group: { _id: "$productId", nRating: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
  ]);

  const Product = mongoose.model("Product");

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.statics.calcStoreAverageRatings = async function (storeId: string) {
  const Product = mongoose.model("Product");
  const Store = mongoose.model("Store");

  // Get all product IDs for this store
  const productIds = await Product.find({ storeId, isDeleted: false }).select("_id");
  const productIdList = productIds.map((p: any) => p._id);

  const stats = await this.aggregate([
    { $match: { productId: { $in: productIdList }, isActive: true } },
    { $group: { _id: null, nRating: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
  ]);

  if (stats.length > 0) {
    await Store.findByIdAndUpdate(storeId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await Store.findByIdAndUpdate(storeId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Gọi calcAverageRatings sau khi tạo mới / cập nhật đánh giá
reviewSchema.post("save", async function () {
  const Product = mongoose.model("Product");
  const constructor = this.constructor as any;

  constructor.calcAverageRatings(this.productId);

  // Also update store ratings
  const product = await Product.findById(this.productId);
  if (product) {
    constructor.calcStoreAverageRatings(product.storeId);
  }
});

// Gọi calcAverageRatings sau khi xóa đánh giá
reviewSchema.post("deleteOne", { document: true, query: false }, async function () {
  const Product = mongoose.model("Product");
  const constructor = this.constructor as any;

  constructor.calcAverageRatings(this.productId);

  const product = await Product.findById(this.productId);
  if (product) {
    constructor.calcStoreAverageRatings(product.storeId);
  }
});

const Review = mongoose.model<IReviewDocument>("Review", reviewSchema);
export default Review;
