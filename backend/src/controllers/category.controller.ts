import { type Request, type Response } from "express";
import categoryService from "../services/category.service.js";
import { AppError } from "../middlewares/error.middleware.js";

class CategoryController {
  async getCategories(req: Request, res: Response) {
    const result = await categoryService.getCategories(req.query);
    if (result && !Array.isArray(result)) {
      res.json({
        success: true,
        categories: result.categories,
        pagination: result.pagination,
        data: result.categories
      });
    } else {
      res.json({
        success: true,
        data: result
      });
    }
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

  async uploadCategoryImage(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      throw new AppError("Không có file nào được tải lên", 400);
    }
    const url = await categoryService.uploadCategoryImage(file);
    res.json({
      success: true,
      message: "Tải ảnh danh mục lên thành công",
      data: { url },
    });
  }
}

export default new CategoryController();
