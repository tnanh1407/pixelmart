import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICampaignItem {
  campaignId: string;
  productId: string;
  order: number;
  isFeatured: boolean;
}

export interface ICampaignItemDocument extends ICampaignItem, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const campaignItemSchema = new mongoose.Schema<ICampaignItemDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    campaignId: {
      type: String,
      ref: "Campaign",
      required: [true, "Mã chiến dịch là bắt buộc"],
      index: true,
    },
    productId: {
      type: String,
      ref: "Product",
      required: [true, "Mã sản phẩm là bắt buộc"],
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      min: [0, "Thứ tự không được âm"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo mỗi sản phẩm chỉ xuất hiện một lần trong một chiến dịch
campaignItemSchema.index({ campaignId: 1, productId: 1 }, { unique: true });

const CampaignItem = mongoose.model<ICampaignItemDocument>("CampaignItem", campaignItemSchema);

export default CampaignItem;
