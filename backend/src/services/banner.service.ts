import Banner, { IBanner } from "../models/banner.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import cloudinary, { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";



class BannerService {
  async getActiveBanners() {
    const filter: any = { isActive: true };

    const now = new Date();
    filter.$or = [
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: null, endDate: null },
    ];

    return await Banner.find(filter).sort({ order: 1, createdAt: -1 });
  }

  async getAllBanners(query: any = {}) {
    const { page = 1, limit = 50, isActive } = query;
    const filter: any = {};

    if (isActive !== undefined) filter.isActive = isActive === "true" || isActive === true;

    const skipIndex = (Number(page) - 1) * Number(limit);
    const banners = await Banner.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    const total = await Banner.countDocuments(filter);

    return {
      banners,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getBannerById(id: string) {
    const banner = await Banner.findById(id);
    if (!banner) {
      throw new AppError("Banner không tồn tại", 404);
    }
    return banner;
  }

  async createBanner(data: Partial<IBanner>) {
    if (!data.title || !data.image) {
      throw new AppError("Tên và ảnh banner là bắt buộc", 400);
    }

    return await Banner.create(data);
  }

  async updateBanner(id: string, data: Partial<IBanner>) {
    const banner = await this.getBannerById(id);

    if (data.title !== undefined) banner.title = data.title;
    if (data.shortDescription !== undefined) banner.shortDescription = data.shortDescription;
    if (data.content !== undefined) banner.content = data.content;
    if (data.image !== undefined) banner.image = data.image;
    if (data.isActive !== undefined) banner.isActive = data.isActive;
    if (data.startDate !== undefined) banner.startDate = data.startDate;
    if (data.endDate !== undefined) banner.endDate = data.endDate;
    if (data.durationInDays !== undefined) banner.durationInDays = data.durationInDays;
    if (data.order !== undefined) banner.order = data.order;

    // Structured Article CMS fields
    if (data.author !== undefined) banner.author = data.author;
    if (data.categoryName !== undefined) banner.categoryName = data.categoryName;
    if (data.sapo !== undefined) banner.sapo = data.sapo;
    if (data.contentSections !== undefined) banner.contentSections = data.contentSections;
    if (data.highlightsTitle !== undefined) banner.highlightsTitle = data.highlightsTitle;
    if (data.highlights !== undefined) banner.highlights = data.highlights;
    if (data.quote !== undefined) banner.quote = data.quote;
    if (data.quoteAuthor !== undefined) banner.quoteAuthor = data.quoteAuthor;

    return await banner.save();
  }

  async deleteBanner(id: string) {
    const banner = await this.getBannerById(id);
    await banner.deleteOne();
    return { message: "Xóa banner thành công" };
  }

  async uploadBannerImage(file: Express.Multer.File): Promise<string> {
    const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: CLOUDINARY_FOLDERS.BANNERS,
    });
    return result.secure_url;
  }
}

export default new BannerService();

