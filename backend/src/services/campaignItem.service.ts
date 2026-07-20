import CampaignItem, { ICampaignItem } from "../models/campaignItem.model.js";
import Campaign from "../models/campaign.model.js";
import Product from "../models/product.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class CampaignItemService {
  async getItemsByCampaign(campaignId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new AppError("Chien dich khong ton tai", 404);
    }

    const items = await CampaignItem.find({ campaignId })
      .populate("productId")
      .sort({ createdAt: 1 });

    return items;
  }

  async getCampaignItemById(id: string) {
    const item = await CampaignItem.findById(id).populate("productId");
    if (!item) {
      throw new AppError("San pham trong chien dich khong ton tai", 404);
    }
    return item;
  }

  async addItemToCampaign(data: Partial<ICampaignItem>) {
    const { campaignId, productId } = data;

    if (!campaignId || !productId) {
      throw new AppError("campaignId va productId la bat buoc", 400);
    }

    const [campaign, product] = await Promise.all([
      Campaign.findById(campaignId),
      Product.findById(productId),
    ]);

    if (!campaign) throw new AppError("Chien dich khong ton tai", 404);
    if (!product) throw new AppError("San pham khong ton tai", 404);

    const existing = await CampaignItem.findOne({ campaignId, productId });
    if (existing) {
      throw new AppError("San pham da ton tai trong chien dich nay", 409);
    }

    const item = await CampaignItem.create(data);
    return item.populate("productId");
  }

  async updateCampaignItem(id: string, data: Partial<ICampaignItem>) {
    const item = await this.getCampaignItemById(id);
    return await item.save();
  }

  async removeItemFromCampaign(id: string) {
    const item = await this.getCampaignItemById(id);
    await item.deleteOne();
    return { message: "Da xoa san pham khoi chien dich thanh cong" };
  }

  async removeAllItemsFromCampaign(campaignId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new AppError("Chien dich khong ton tai", 404);
    }

    const result = await CampaignItem.deleteMany({ campaignId });
    return { message: `Da xoa ${result.deletedCount} san pham khoi chien dich` };
  }
}

export default new CampaignItemService();
