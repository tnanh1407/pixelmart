import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IStoreFollow {
  userId: string;
  storeId: string;
}

export interface IStoreFollowDocument extends IStoreFollow, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const storeFollowSchema = new mongoose.Schema<IStoreFollowDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    storeId: {
      type: String,
      ref: "Store",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

storeFollowSchema.index({ userId: 1, storeId: 1 }, { unique: true });

const StoreFollow = mongoose.model<IStoreFollowDocument>("StoreFollow", storeFollowSchema);

export default StoreFollow;
