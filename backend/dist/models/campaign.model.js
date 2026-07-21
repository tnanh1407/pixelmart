import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
export const CAMPAIGN_TYPE = {
    PROMOTION: "promotion",
    BLOG: "blog",
};
const campaignSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
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
    image: {
        type: String,
        required: [true, "Hinh anh la bat buoc"],
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
}, {
    timestamps: true,
});
const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
