import { Router } from "express";
import productController from "../../controllers/product.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", asyncHandler(productController.getProducts.bind(productController)));
router.get("/:id", asyncHandler(productController.getProductById.bind(productController)));

// Authenticated users
router.post("/", auth, asyncHandler(productController.createProduct.bind(productController)));
router.put("/:id", auth, asyncHandler(productController.updateProduct.bind(productController)));
router.delete("/:id", auth, asyncHandler(productController.deleteProduct.bind(productController)));

export default router;
