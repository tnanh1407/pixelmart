import Banner, { IBanner } from "../models/banner.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class BannerService {
  async getActiveBanners(position?: string) {
    const filter: any = { isActive: true };

    if (position) {
      filter.position = position;
    }

    const now = new Date();
    filter.$or = [
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: null, endDate: null },
    ];

    return await Banner.find(filter).sort({ order: 1, createdAt: -1 });
  }

  async getAllBanners(query: any = {}) {
    const { page = 1, limit = 50, position, isActive } = query;
    const filter: any = {};

    if (position) filter.position = position;
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
    if (data.image !== undefined) banner.image = data.image;
    if (data.link !== undefined) banner.link = data.link;
    if (data.position !== undefined) banner.position = data.position;
    if (data.isActive !== undefined) banner.isActive = data.isActive;
    if (data.startDate !== undefined) banner.startDate = data.startDate;
    if (data.endDate !== undefined) banner.endDate = data.endDate;
    if (data.order !== undefined) banner.order = data.order;

    return await banner.save();
  }

  async deleteBanner(id: string) {
    const banner = await this.getBannerById(id);
    await banner.deleteOne();
    return { message: "Xóa banner thành công" };
  }
}

export default new BannerService();
