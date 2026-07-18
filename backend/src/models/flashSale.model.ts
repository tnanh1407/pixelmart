import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type FlashSaleStatus = "scheduled" | "active" | "ended" | "cancelled";

export interface IFlashSale {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: FlashSaleStatus;
}

export interface IFlashSaleDocument extends IFlashSale, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const flashSaleSchema = new mongoose.Schema<IFlashSaleDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    name: {
      type: String,
      required: [true, "Tên chương trình Flash Sale là bắt buộc"],
      trim: true,
      maxlength: [200, "Tên tối đa 200 ký tự"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    startDate: {
      type: Date,
      required: [true, "Thời gian bắt đầu là bắt buộc"],
    },
    endDate: {
      type: Date,
      required: [true, "Thời gian kết thúc là bắt buộc"],
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "ended", "cancelled"],
      default: "scheduled",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

flashSaleSchema.index({ startDate: 1, endDate: 1 });
flashSaleSchema.index({ status: 1, startDate: 1 });

flashSaleSchema.pre("validate", function () {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate("endDate", "Thời gian kết thúc phải sau thời gian bắt đầu");
  }
});

flashSaleSchema.pre("save", function () {
  // Tự động tính status dựa trên thời gian, trừ khi được set thủ công
  if (!this.isModified("status") || this.status === "scheduled") {
    const now = new Date();
    if (this.endDate < now) {
      this.status = "ended";
    } else if (this.startDate <= now && this.endDate >= now) {
      this.status = "active";
    } else if (this.startDate > now) {
      this.status = "scheduled";
    }
  }
});

const FlashSale = mongoose.model<IFlashSaleDocument>("FlashSale", flashSaleSchema);

export default FlashSale;
