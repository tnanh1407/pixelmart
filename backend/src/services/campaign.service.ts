import Campaign, { ICampaign } from "../models/campaign.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import cloudinary, { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";

class CampaignService {
  async getActiveCampaigns() {
    const filter: any = { isActive: true };

    const now = new Date();
    filter.$or = [
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: null, endDate: null },
    ];

    return await Campaign.find(filter).sort({ createdAt: -1 });
  }

  async getAllCampaigns(query: any = {}) {
    const { page = 1, limit = 50, isActive, search } = query;
    const filter: any = {};

    if (isActive !== undefined) filter.isActive = isActive === "true" || isActive === true;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    const total = await Campaign.countDocuments(filter);

    return {
      campaigns,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getCampaignById(id: string) {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      throw new AppError("Chien dich khong ton tai", 404);
    }
    return campaign;
  }

  async createCampaign(data: Partial<ICampaign>) {
    if (!data.title) {
      throw new AppError("Ten chien dich la bat buoc", 400);
    }

    return await Campaign.create(data);
  }

  async updateCampaign(id: string, data: Partial<ICampaign>) {
    const campaign = await this.getCampaignById(id);

    if (data.title !== undefined) campaign.title = data.title;
    if (data.shortDescription !== undefined) campaign.shortDescription = data.shortDescription;
    if (data.content !== undefined) campaign.content = data.content;
    if (data.isActive !== undefined) campaign.isActive = data.isActive;
    if (data.startDate !== undefined) campaign.startDate = data.startDate;
    if (data.endDate !== undefined) campaign.endDate = data.endDate;
    if (data.durationInDays !== undefined) campaign.durationInDays = data.durationInDays;
    if (data.authorId !== undefined) campaign.authorId = data.authorId;
    if (data.sapo !== undefined) campaign.sapo = data.sapo;
    if (data.contentSections !== undefined) campaign.contentSections = data.contentSections;
    if (data.highlightsTitle !== undefined) campaign.highlightsTitle = data.highlightsTitle;
    if (data.highlights !== undefined) campaign.highlights = data.highlights;
    if (data.quote !== undefined) campaign.quote = data.quote;
    if (data.quoteAuthor !== undefined) campaign.quoteAuthor = data.quoteAuthor;

    return await campaign.save();
  }

  async deleteCampaign(id: string) {
    const campaign = await this.getCampaignById(id);
    await campaign.deleteOne();
    return { message: "Xoa chien dich thanh cong" };
  }

  async uploadCampaignImage(file: Express.Multer.File): Promise<string> {
    const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: CLOUDINARY_FOLDERS.CAMPAIGNS,
    });
    return result.secure_url;
  }
}

export default new CampaignService();
