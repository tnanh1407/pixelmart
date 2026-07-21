import campaignService from "../services/campaign.service.js";
import { AppError } from "../middlewares/error.middleware.js";
class CampaignController {
    async getActiveCampaigns(req, res) {
        const campaigns = await campaignService.getActiveCampaigns();
        res.json({
            success: true,
            data: campaigns,
        });
    }
    async getAllCampaigns(req, res) {
        const result = await campaignService.getAllCampaigns(req.query);
        res.json({
            success: true,
            ...result,
        });
    }
    async getCampaignById(req, res) {
        const campaign = await campaignService.getCampaignById(req.params.id);
        res.json({
            success: true,
            data: campaign,
        });
    }
    async createCampaign(req, res) {
        const campaign = await campaignService.createCampaign(req.body);
        res.status(201).json({
            success: true,
            data: campaign,
        });
    }
    async updateCampaign(req, res) {
        const campaign = await campaignService.updateCampaign(req.params.id, req.body);
        res.json({
            success: true,
            data: campaign,
        });
    }
    async deleteCampaign(req, res) {
        const result = await campaignService.deleteCampaign(req.params.id);
        res.json({
            success: true,
            ...result,
        });
    }
    async uploadCampaignImage(req, res) {
        const file = req.file;
        if (!file) {
            throw new AppError("Không có file nào được tải lên", 400);
        }
        const url = await campaignService.uploadCampaignImage(file);
        res.json({
            success: true,
            message: "Tải ảnh chiến dịch lên thành công",
            data: { url },
        });
    }
}
export default new CampaignController();
