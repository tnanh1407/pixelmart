import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IStore {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  ownerId: string;
  phone?: string;
  email?: string;
  street?: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  policies?: any;
  isVerified: boolean;
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
      required: [true, "Ten cua hang la bat buoc"],
      trim: true,
      minlength: [2, "Ten cua hang phai co it nhat 2 ky tu"],
      maxlength: [100, "Ten cua hang toi da 100 ky tu"],
    },
    slug: {
      type: String,
      required: [true, "Slug cua hang la bat buoc"],
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
      ref: "User",
      required: [true, "Chu so huu cua hang la bat buoc"],
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    provinceCode: {
      type: String,
    },
    districtCode: {
      type: String,
    },
    wardCode: {
      type: String,
    },
    policies: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
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

storeSchema.index({ name: "text", description: "text" });

const Store = mongoose.model<IStoreDocument>("Store", storeSchema);

export default Store;
