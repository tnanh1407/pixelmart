import { Router } from "express";
import campaignController from "../../controllers/campaign.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { uploadCampaignImage } from "../../middlewares/upload.middleware.js";
const router = Router();
// Public
router.get("/", asyncHandler(campaignController.getActiveCampaigns.bind(campaignController)));
router.get("/all", auth, checkRole("admin"), asyncHandler(campaignController.getAllCampaigns.bind(campaignController)));
router.get("/:id", asyncHandler(campaignController.getCampaignById.bind(campaignController)));
router.post("/", auth, checkRole("admin"), asyncHandler(campaignController.createCampaign.bind(campaignController)));
router.post("/upload", auth, checkRole("admin"), ...uploadCampaignImage, asyncHandler(campaignController.uploadCampaignImage.bind(campaignController)));
router.patch("/:id", auth, checkRole("admin"), asyncHandler(campaignController.updateCampaign.bind(campaignController)));
router.delete("/:id", auth, checkRole("admin"), asyncHandler(campaignController.deleteCampaign.bind(campaignController)));
export default router;
