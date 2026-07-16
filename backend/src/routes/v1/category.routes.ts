import { Router } from "express";
import categoryController from "../../controllers/category.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { uploadBannerImage } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", asyncHandler(categoryController.getCategories.bind(categoryController)));
router.get("/:id", asyncHandler(categoryController.getCategoryById.bind(categoryController)));

// Admin only actions
router.post("/", auth, checkRole("admin"), asyncHandler(categoryController.createCategory.bind(categoryController)));
router.post("/upload", auth, checkRole("admin"), ...uploadBannerImage, asyncHandler(categoryController.uploadCategoryImage.bind(categoryController)));
router.put("/:id", auth, checkRole("admin"), asyncHandler(categoryController.updateCategory.bind(categoryController)));
router.delete("/:id", auth, checkRole("admin"), asyncHandler(categoryController.deleteCategory.bind(categoryController)));

export default router;
