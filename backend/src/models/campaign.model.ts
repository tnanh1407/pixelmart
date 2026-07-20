import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  durationInDays?: number;
  authorId?: string;
  sapo?: string;
  contentSections?: any;
  highlightsTitle?: string;
  highlights?: any;
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
      required: [true, "Ten chien dich la bat buoc"],
      trim: true,
      maxlength: [500, "Ten chien dich toi da 500 ky tu"],
    },
    slug: {
      type: String,
      required: [true, "Slug la bat buoc"],
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
      maxlength: [500, "Mo ta ngan toi da 500 ky tu"],
      default: "",
    },
    content: {
      type: String,
      trim: true,
      default: "",
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
    authorId: {
      type: String,
      ref: "User",
      default: null,
    },
    sapo: {
      type: String,
      default: "",
      trim: true,
    },
    contentSections: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    highlightsTitle: {
      type: String,
      default: "",
      trim: true,
    },
    highlights: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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
