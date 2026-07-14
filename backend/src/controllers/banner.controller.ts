import { type Request, type Response } from "express";
import bannerService from "../services/banner.service.js";

class BannerController {
  async getActiveBanners(req: Request, res: Response) {
    const { position } = req.query;
    const banners = await bannerService.getActiveBanners(position as string);
    res.json({
      success: true,
      data: banners,
    });
  }

  async getAllBanners(req: Request, res: Response) {
    const result = await bannerService.getAllBanners(req.query);
    res.json({
      success: true,
      ...result,
    });
  }

  async getBannerById(req: Request, res: Response) {
    const banner = await bannerService.getBannerById(req.params.id as string);
    res.json({
      success: true,
      data: banner,
    });
  }

  async createBanner(req: Request, res: Response) {
    const banner = await bannerService.createBanner(req.body);
    res.status(201).json({
      success: true,
      data: banner,
    });
  }

  async updateBanner(req: Request, res: Response) {
    const banner = await bannerService.updateBanner(req.params.id as string, req.body);
    res.json({
      success: true,
      data: banner,
    });
  }

  async deleteBanner(req: Request, res: Response) {
    const result = await bannerService.deleteBanner(req.params.id as string);
    res.json({
      success: true,
      ...result,
    });
  }
}

export default new BannerController();
