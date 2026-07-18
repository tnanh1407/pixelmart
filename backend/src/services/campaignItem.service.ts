import CampaignItem, { ICampaignItem } from "../models/campaignItem.model.js";
import Campaign from "../models/campaign.model.js";
import Product from "../models/product.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class CampaignItemService {
  async getItemsByCampaign(campaignId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new AppError("Chiến dịch không tồn tại", 404);
    }

    const items = await CampaignItem.find({ campaignId })
      .populate("productId")
      .sort({ order: 1, createdAt: 1 });

    return items;
  }

  async getCampaignItemById(id: string) {
    const item = await CampaignItem.findById(id).populate("productId");
    if (!item) {
      throw new AppError("Sản phẩm trong chiến dịch không tồn tại", 404);
    }
    return item;
  }

  async addItemToCampaign(data: Partial<ICampaignItem>) {
    const { campaignId, productId } = data;

    if (!campaignId || !productId) {
      throw new AppError("campaignId và productId là bắt buộc", 400);
    }

    const [campaign, product] = await Promise.all([
      Campaign.findById(campaignId),
      Product.findById(productId),
    ]);

    if (!campaign) throw new AppError("Chiến dịch không tồn tại", 404);
    if (!product) throw new AppError("Sản phẩm không tồn tại", 404);

    const existing = await CampaignItem.findOne({ campaignId, productId });
    if (existing) {
      throw new AppError("Sản phẩm đã tồn tại trong chiến dịch này", 409);
    }

    const item = await CampaignItem.create(data);
    return item.populate("productId");
  }

  async updateCampaignItem(id: string, data: Partial<ICampaignItem>) {
    const item = await this.getCampaignItemById(id);

    if (data.order !== undefined) item.order = data.order;
    if (data.isFeatured !== undefined) item.isFeatured = data.isFeatured;

    return await item.save();
  }

  async removeItemFromCampaign(id: string) {
    const item = await this.getCampaignItemById(id);
    await item.deleteOne();
    return { message: "Đã xóa sản phẩm khỏi chiến dịch thành công" };
  }

  async removeAllItemsFromCampaign(campaignId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new AppError("Chiến dịch không tồn tại", 404);
    }

    const result = await CampaignItem.deleteMany({ campaignId });
    return { message: `Đã xóa ${result.deletedCount} sản phẩm khỏi chiến dịch` };
  }
}

export default new CampaignItemService();
