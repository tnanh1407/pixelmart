import { Router } from "express";
import userController from "../../controllers/user.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { uploadAvatar } from "../../middlewares/upload.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.get("/", checkRole(ROLES.ADMIN), asyncHandler(userController.getAll.bind(userController)));

router.get("/:id", asyncHandler(userController.getById.bind(userController)));

router.patch("/:id", checkRole(ROLES.ADMIN), asyncHandler(userController.update.bind(userController)));

router.patch("/profile", auth, ...uploadAvatar, asyncHandler(userController.updateProfile.bind(userController)));

router.post("/addresses", auth, asyncHandler(userController.addAddress.bind(userController)));
router.patch("/addresses/:addressId", auth, asyncHandler(userController.updateAddress.bind(userController)));
router.delete("/addresses/:addressId", auth, asyncHandler(userController.deleteAddress.bind(userController)));
router.patch("/addresses/:addressId/default", auth, asyncHandler(userController.setDefaultAddress.bind(userController)));

router.patch("/:id/toggle-active", checkRole(ROLES.ADMIN), asyncHandler(userController.toggleActive.bind(userController)));

router.delete("/:id", checkRole(ROLES.ADMIN), asyncHandler(userController.delete.bind(userController)));

export default router;
