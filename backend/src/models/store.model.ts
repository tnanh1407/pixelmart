import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IStore {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  ownerId: string; // The Vendor who owns this Store
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
  };
  followersCount?: number;
  policies?: string[];
  isVerified: boolean; // Official Mall / Verified Shop
  ratingsAverage: number;
  ratingsQuantity: number;
  isActive: boolean;
}

export interface IStoreDocument extends IStore, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new mongoose.Schema<IStoreDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    name: {
      type: String,
      required: [true, "Tên cửa hàng là bắt buộc"],
      unique: true,
      trim: true,
      minlength: [2, "Tên cửa hàng phải có ít nhất 2 ký tự"],
      maxlength: [100, "Tên cửa hàng tối đa 100 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug cửa hàng là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    ownerId: {
      type: String,
      ref: "Vendor",
      required: [true, "Chủ sở hữu cửa hàng là bắt buộc"],
      unique: true, // Mỗi Vendor chỉ sở hữu tối đa 1 Store
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại cửa hàng không hợp lệ"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      ward: { type: String, trim: true },
      district: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    policies: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Đánh giá cửa hàng từ 0 đến 5"],
      max: [5, "Đánh giá cửa hàng từ 0 đến 5"],
      set: (val: number) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
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

// Hỗ trợ tìm kiếm theo tên và mô tả cửa hàng
storeSchema.index({ name: "text", description: "text" });

const Store = mongoose.model<IStoreDocument>("Store", storeSchema);

export default Store;
