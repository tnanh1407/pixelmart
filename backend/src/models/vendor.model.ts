import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const VENDOR_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
} as const;

export interface IVendor {
  userId: string;
  shopName: string;
  businessName?: string;
  taxCode?: string;
  identityNumber?: string;
  identityFront?: string;
  identityBack?: string;
  businessLicense?: string;
  email?: string;
  phone?: string;
  description?: string;
  avatar?: string;
  banner?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  status: (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS];
  rejectionReason?: string;
  verifiedAt?: Date;
  approvedBy?: string;
}

export interface IVendorDocument extends IVendor, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new mongoose.Schema<IVendorDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    userId: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    businessName: {
      type: String,
      trim: true,
      default: null,
    },

    taxCode: {
      type: String,
      trim: true,
      default: null,
    },

    identityNumber: {
      type: String,
      trim: true,
      default: null,
    },

    identityFront: {
      type: String,
      default: null,
    },

    identityBack: {
      type: String,
      default: null,
    },

    businessLicense: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: null,
    },

    banner: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    bankName: {
      type: String,
      trim: true,
      default: null,
    },

    bankAccountNumber: {
      type: String,
      trim: true,
      default: null,
    },

    bankAccountHolder: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(VENDOR_STATUS),
      default: VENDOR_STATUS.PENDING,
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: String,
      ref: "User",
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

vendorSchema.index({ shopName: "text", businessName: "text" });

const Vendor = mongoose.model<IVendorDocument>("Vendor", vendorSchema);

export default Vendor;
