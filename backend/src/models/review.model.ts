import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IReview {
  userId: string;
  productId: string;
  orderId: string;
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
      required: [true, "Nguoi dung danh gia la bat buoc"],
      index: true,
    },
    productId: {
      type: String,
      ref: "Product",
      required: [true, "San pham duoc danh gia la bat buoc"],
      index: true,
    },
    orderId: {
      type: String,
      ref: "Order",
      required: [true, "Don hang la bat buoc"],
    },
    rating: {
      type: Number,
      required: [true, "So sao danh gia la bat buoc"],
      min: [1, "Danh gia toi thieu la 1 sao"],
      max: [5, "Danh gia toi da la 5 sao"],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Tieu de toi da 200 ky tu"],
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      default: [],
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

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Review = mongoose.model<IReviewDocument>("Review", reviewSchema);
export default Review;
