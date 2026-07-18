import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IVoucherUsage {
  voucherId: string;
  userId: string;
  orderId: string;
}

export interface IVoucherUsageDocument extends IVoucherUsage, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const voucherUsageSchema = new mongoose.Schema<IVoucherUsageDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    voucherId: {
      type: String,
      ref: "Voucher",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },

    orderId: {
      type: String,
      ref: "Order",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

voucherUsageSchema.index({ voucherId: 1, userId: 1 }, { unique: true });

const VoucherUsage = mongoose.model<IVoucherUsageDocument>("VoucherUsage", voucherUsageSchema);

export default VoucherUsage;
