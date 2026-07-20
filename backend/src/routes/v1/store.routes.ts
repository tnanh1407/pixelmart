import { Router } from "express";
import storeController from "../../controllers/store.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.get("/", asyncHandler(storeController.getStores.bind(storeController)));
router.get("/me", auth, asyncHandler(storeController.getMyStore.bind(storeController)));
router.get("/followed", auth, asyncHandler(storeController.getFollowedStores.bind(storeController)));
router.get("/:id", asyncHandler(storeController.getStoreById.bind(storeController)));
router.get("/:id/followers", asyncHandler(storeController.getStoreFollowers.bind(storeController)));

router.post("/", auth, checkRole(ROLES.ADMIN), asyncHandler(storeController.createStore.bind(storeController)));
router.patch("/:id", auth, checkRole(ROLES.ADMIN), asyncHandler(storeController.updateStore.bind(storeController)));
router.delete("/:id", auth, checkRole(ROLES.ADMIN), asyncHandler(storeController.deleteStore.bind(storeController)));

router.post("/:id/follow", auth, asyncHandler(storeController.followStore.bind(storeController)));
router.delete("/:id/follow", auth, asyncHandler(storeController.unfollowStore.bind(storeController)));
router.get("/:id/follow/status", auth, asyncHandler(storeController.checkFollowStatus.bind(storeController)));

export default router;
