import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IReview {
  userId: string;       // Người đánh giá
  productId: string;    // Sản phẩm được đánh giá
  storeId: string;      // Cửa hàng sở hữu sản phẩm (để thống kê điểm cửa hàng)
  rating: number;       // Số sao (1 đến 5)
  comment?: string;     // Bình luận của khách hàng
  images: string[];     // Danh sách ảnh đánh giá
  isActive: boolean;    // Admin có thể ẩn đánh giá vi phạm
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
    storeId: {
      type: String,
      ref: "Store",
      required: [true, "Cửa hàng của sản phẩm là bắt buộc"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Số sao đánh giá là bắt buộc"],
      min: [1, "Đánh giá tối thiểu là 1 sao"],
      max: [5, "Đánh giá tối đa là 5 sao"],
      index: true,
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
    {
      $match: { productId, isActive: true },
    },
    {
      $group: {
        _id: "$productId",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Gọi calcAverageRatings sau khi tạo mới / cập nhật đánh giá
reviewSchema.post("save", function () {
  (this.constructor as any).calcAverageRatings(this.productId);
});

// Gọi calcAverageRatings sau khi xóa đánh giá
reviewSchema.post("deleteOne", { document: true, query: false }, function () {
  (this.constructor as any).calcAverageRatings(this.productId);
});

const Review = mongoose.model<IReviewDocument>("Review", reviewSchema);
export default Review;
