import { Router } from "express";
import userController from "../../controllers/user.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { uploadAvatar } from "../../middlewares/upload.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.get("/", checkRole(ROLES.ADMIN), asyncHandler(userController.getAll.bind(userController)));

router.get("/:id", asyncHandler(userController.getById.bind(userController)));

router.put("/:id", asyncHandler(userController.update.bind(userController)));

router.patch("/avatar", ...uploadAvatar, asyncHandler(userController.uploadAvatar.bind(userController)));

router.patch("/:id/toggle-active", checkRole(ROLES.ADMIN), asyncHandler(userController.toggleActive.bind(userController)));

router.delete("/:id", checkRole(ROLES.ADMIN), asyncHandler(userController.delete.bind(userController)));

export default router;
