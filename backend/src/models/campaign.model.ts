import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICampaignSubsection {
  title?: string;
  content?: string;
}

export const CAMPAIGN_TYPE = {
  PROMOTION: "promotion",
  BLOG: "blog",
} as const;

export interface ICampaign {
  title: string;
  slug: string;
  type: (typeof CAMPAIGN_TYPE)[keyof typeof CAMPAIGN_TYPE];
  shortDescription?: string;
  content?: string;
  sourceUrl: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  durationInDays?: number;
  order: number;
  author?: string;
  categoryName?: string;
  sapo?: string;
  contentSections?: ICampaignSubsection[];
  highlightsTitle?: string;
  highlights?: string[];
  quote?: string;
  quoteAuthor?: string;
}

export interface ICampaignDocument extends ICampaign, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new mongoose.Schema<ICampaignDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    title: {
      type: String,
      required: [true, "Tên chiến dịch là bắt buộc"],
      trim: true,
      maxlength: [200, "Tên chiến dịch tối đa 200 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: Object.values(CAMPAIGN_TYPE),
      default: CAMPAIGN_TYPE.PROMOTION,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Mô tả ngắn tối đa 500 ký tự"],
      default: "",
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    sourceUrl: {
      type: String,
      required: [true, "Ảnh chiến dịch là bắt buộc"],
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
    durationInDays: {
      type: Number,
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
    highlights: {
      type: [String],
      default: [],
    },
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

const Campaign = mongoose.model<ICampaignDocument>("Campaign", campaignSchema);

export default Campaign;
