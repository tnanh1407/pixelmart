import campaignItemService from "../services/campaignItem.service.js";
class CampaignItemController {
    async getItemsByCampaign(req, res) {
        const items = await campaignItemService.getItemsByCampaign(String(req.params.campaignId));
        res.json({
            success: true,
            data: items,
        });
    }
    async getCampaignItemById(req, res) {
        const item = await campaignItemService.getCampaignItemById(String(req.params.id));
        res.json({
            success: true,
            data: item,
        });
    }
    async addItemToCampaign(req, res) {
        const item = await campaignItemService.addItemToCampaign({
            ...req.body,
            campaignId: String(req.params.campaignId),
        });
        res.status(201).json({
            success: true,
            data: item,
        });
    }
    async updateCampaignItem(req, res) {
        const item = await campaignItemService.updateCampaignItem(String(req.params.id), req.body);
        res.json({
            success: true,
            data: item,
        });
    }
    async removeItemFromCampaign(req, res) {
        const result = await campaignItemService.removeItemFromCampaign(String(req.params.id));
        res.json({
            success: true,
            ...result,
        });
    }
    async removeAllItemsFromCampaign(req, res) {
        const result = await campaignItemService.removeAllItemsFromCampaign(String(req.params.campaignId));
        res.json({
            success: true,
            ...result,
        });
    }
}
export default new CampaignItemController();
