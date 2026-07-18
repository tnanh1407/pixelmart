import { Router } from "express";
import campaignItemController from "../../controllers/campaignItem.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

// Nested under /api/v1/campaigns/:campaignId/items
// GET    /api/v1/campaigns/:campaignId/items        - Lấy tất cả sản phẩm của chiến dịch (public)
// POST   /api/v1/campaigns/:campaignId/items        - Thêm sản phẩm vào chiến dịch (admin)
// DELETE /api/v1/campaigns/:campaignId/items        - Xóa toàn bộ sản phẩm của chiến dịch (admin)

router.get(
  "/",
  asyncHandler(campaignItemController.getItemsByCampaign.bind(campaignItemController))
);

router.post(
  "/",
  auth,
  checkRole("admin"),
  asyncHandler(campaignItemController.addItemToCampaign.bind(campaignItemController))
);

router.delete(
  "/",
  auth,
  checkRole("admin"),
  asyncHandler(campaignItemController.removeAllItemsFromCampaign.bind(campaignItemController))
);

// Standalone item routes (gắn riêng ở app.ts dưới /api/v1/campaign-items)
// GET    /api/v1/campaign-items/:id   - Lấy chi tiết một item
// PATCH  /api/v1/campaign-items/:id   - Cập nhật order / isFeatured (admin)
// DELETE /api/v1/campaign-items/:id   - Xóa một item (admin)

export const campaignItemStandaloneRouter = Router();

campaignItemStandaloneRouter.get(
  "/:id",
  asyncHandler(campaignItemController.getCampaignItemById.bind(campaignItemController))
);

campaignItemStandaloneRouter.patch(
  "/:id",
  auth,
  checkRole("admin"),
  asyncHandler(campaignItemController.updateCampaignItem.bind(campaignItemController))
);

campaignItemStandaloneRouter.delete(
  "/:id",
  auth,
  checkRole("admin"),
  asyncHandler(campaignItemController.removeItemFromCampaign.bind(campaignItemController))
);

export default router;
