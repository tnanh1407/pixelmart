import { Router } from "express";
import storeController from "../../controllers/store.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", asyncHandler(storeController.getStores.bind(storeController)));
router.get("/me", auth, asyncHandler(storeController.getMyStore.bind(storeController)));
router.get("/:id", asyncHandler(storeController.getStoreById.bind(storeController)));

// Authenticated users
router.post("/", auth, asyncHandler(storeController.createStore.bind(storeController)));
router.put("/:id", auth, asyncHandler(storeController.updateStore.bind(storeController)));
router.delete("/:id", auth, asyncHandler(storeController.deleteStore.bind(storeController)));

// Follow/Unfollow
router.post("/:id/follow", auth, asyncHandler(storeController.followStore.bind(storeController)));
router.delete("/:id/follow", auth, asyncHandler(storeController.unfollowStore.bind(storeController)));
router.get("/:id/follow/status", auth, asyncHandler(storeController.checkFollowStatus.bind(storeController)));

export default router;
