import { Router } from "express";
import addressController from "../../controllers/address.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
const router = Router();
router.get("/provinces", asyncHandler(addressController.getProvinces.bind(addressController)));
router.get("/districts", asyncHandler(addressController.getDistricts.bind(addressController)));
router.get("/wards", asyncHandler(addressController.getWards.bind(addressController)));
export default router;
