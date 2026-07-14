import { type Request, type Response } from "express";
import categoryService from "../services/category.service.js";

class CategoryController {
  async getCategories(req: Request, res: Response) {
    const categories = await categoryService.getCategories(req.query);
    res.json({
      success: true,
      data: categories
    });
  }

  async getCategoryById(req: Request, res: Response) {
    const category = await categoryService.getCategoryById(req.params.id as string);
    res.json({
      success: true,
      data: category
    });
  }

  async createCategory(req: Request, res: Response) {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      data: category
    });
  }

  async updateCategory(req: Request, res: Response) {
    const category = await categoryService.updateCategory(req.params.id as string, req.body);
    res.json({
      success: true,
      data: category
    });
  }

  async deleteCategory(req: Request, res: Response) {
    const result = await categoryService.deleteCategory(req.params.id as string);
    res.json({
      success: true,
      ...result
    });
  }
}

export default new CategoryController();
