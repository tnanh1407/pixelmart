import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IBannerSubsection {
  title?: string;
  content?: string;
}

export interface IBanner {
  title: string;
  shortDescription?: string;
  content?: string;
  image: string;
  link?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  order: number;
  // Structured Article fields
  author?: string;
  categoryName?: string;
  sapo?: string;
  contentSections?: IBannerSubsection[];
  highlightsTitle?: string;
  highlights?: string[];
  quote?: string;
  quoteAuthor?: string;
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
      required: [true, "Tên banner là bắt buộc"],
      trim: true,
      maxlength: [200, "Tên banner tối đa 200 ký tự"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Mô tả ngắn tối đa 500 ký tự"],
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: [true, "Ảnh banner là bắt buộc"],
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
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    // Structured Article CMS fields
    author: {
      type: String,
      default: "",
      trim: true,
    },
    categoryName: {
      type: String,
      default: "",
      trim: true,
    },
    sapo: {
      type: String,
      default: "",
      trim: true,
    },
    contentSections: [
      {
        title: { type: String, default: "", trim: true },
        content: { type: String, default: "", trim: true },
      },
    ],
    highlightsTitle: {
      type: String,
      default: "",
      trim: true,
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    quote: {
      type: String,
      default: "",
      trim: true,
    },
    quoteAuthor: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model<IBannerDocument>("Banner", bannerSchema);

export default Banner;
