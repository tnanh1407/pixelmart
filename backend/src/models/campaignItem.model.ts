import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICampaignItem {
  campaignId: string;
  productId: string;
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
      required: [true, "Ma chien dich la bat buoc"],
      index: true,
    },
    productId: {
      type: String,
      ref: "Product",
      required: [true, "Ma san pham la bat buoc"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

campaignItemSchema.index({ campaignId: 1, productId: 1 }, { unique: true });

const CampaignItem = mongoose.model<ICampaignItemDocument>("CampaignItem", campaignItemSchema);

export default CampaignItem;
