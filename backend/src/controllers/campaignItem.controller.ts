import { type Request, type Response } from "express";
import campaignItemService from "../services/campaignItem.service.js";

class CampaignItemController {
  async getItemsByCampaign(req: Request, res: Response) {
    const items = await campaignItemService.getItemsByCampaign(req.params.campaignId);
    res.json({
      success: true,
      data: items,
    });
  }

  async getCampaignItemById(req: Request, res: Response) {
    const item = await campaignItemService.getCampaignItemById(req.params.id);
    res.json({
      success: true,
      data: item,
    });
  }

  async addItemToCampaign(req: Request, res: Response) {
    const item = await campaignItemService.addItemToCampaign({
      ...req.body,
      campaignId: req.params.campaignId,
    });
    res.status(201).json({
      success: true,
      data: item,
    });
  }

  async updateCampaignItem(req: Request, res: Response) {
    const item = await campaignItemService.updateCampaignItem(req.params.id, req.body);
    res.json({
      success: true,
      data: item,
    });
  }

  async removeItemFromCampaign(req: Request, res: Response) {
    const result = await campaignItemService.removeItemFromCampaign(req.params.id);
    res.json({
      success: true,
      ...result,
    });
  }

  async removeAllItemsFromCampaign(req: Request, res: Response) {
    const result = await campaignItemService.removeAllItemsFromCampaign(req.params.campaignId);
    res.json({
      success: true,
      ...result,
    });
  }
}

export default new CampaignItemController();
