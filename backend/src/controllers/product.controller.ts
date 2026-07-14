import { type Request, type Response } from "express";
import productService from "../services/product.service.js";

class ProductController {
  async getProducts(req: Request, res: Response) {
    const result = await productService.getProducts(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  async getProductById(req: Request, res: Response) {
    const product = await productService.getProductById(req.params.id as string);
    res.json({
      success: true,
      data: product
    });
  }

  async createProduct(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const product = await productService.createProduct(userId, userRole, req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  }

  async updateProduct(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const product = await productService.updateProduct(userId, userRole, req.params.id as string, req.body);
    res.json({
      success: true,
      data: product
    });
  }

  async deleteProduct(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const result = await productService.deleteProduct(userId, userRole, req.params.id as string);
    res.json({
      success: true,
      ...result
    });
  }
}

export default new ProductController();
