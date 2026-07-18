import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const BANNER_POSITION = {
  HOME_TOP: "home_top",
  HOME_MIDDLE: "home_middle",
  SIDEBAR: "sidebar",
  POPUP: "popup",
} as const;

export const BANNER_TYPE = {
  SLIDER: "slider",
  STATIC: "static",
  PROMO_CARD: "promo_card",
} as const;

export interface IBanner {
  title: string;
  image: string;
  targetUrl?: string;
  position: (typeof BANNER_POSITION)[keyof typeof BANNER_POSITION];
  type: (typeof BANNER_TYPE)[keyof typeof BANNER_TYPE];
  order: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface IBannerDocument extends IBanner, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new mongoose.Schema<IBannerDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    title: {
      type: String,
      required: [true, "Tiêu đề banner là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề tối đa 200 ký tự"],
    },

    image: {
      type: String,
      required: [true, "Ảnh banner là bắt buộc"],
    },

    targetUrl: {
      type: String,
      default: null,
    },

    position: {
      type: String,
      enum: Object.values(BANNER_POSITION),
      required: [true, "Vị trí banner là bắt buộc"],
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(BANNER_TYPE),
      default: BANNER_TYPE.STATIC,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ position: 1, isActive: 1, order: 1 });

const Banner = mongoose.model<IBannerDocument>("Banner", bannerSchema);

export default Banner;
