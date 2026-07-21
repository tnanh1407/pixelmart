import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const campaignItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
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
}, {
    timestamps: true,
});
campaignItemSchema.index({ campaignId: 1, productId: 1 }, { unique: true });
const CampaignItem = mongoose.model("CampaignItem", campaignItemSchema);
export default CampaignItem;
