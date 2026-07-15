import { Router } from "express";
import bannerController from "../../controllers/banner.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { uploadBannerImage } from "../../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", asyncHandler(bannerController.getActiveBanners.bind(bannerController)));
router.get("/all", auth, checkRole("admin"), asyncHandler(bannerController.getAllBanners.bind(bannerController)));
router.get("/:id", asyncHandler(bannerController.getBannerById.bind(bannerController)));
router.post("/", auth, checkRole("admin"), asyncHandler(bannerController.createBanner.bind(bannerController)));
router.post("/upload", auth, checkRole("admin"), ...uploadBannerImage, asyncHandler(bannerController.uploadBannerImage.bind(bannerController)));
router.put("/:id", auth, checkRole("admin"), asyncHandler(bannerController.updateBanner.bind(bannerController)));
router.delete("/:id", auth, checkRole("admin"), asyncHandler(bannerController.deleteBanner.bind(bannerController)));

export default router;

