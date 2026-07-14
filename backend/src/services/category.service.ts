import Category, { ICategory } from "../models/category.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class CategoryService {
  async getCategories(query: any = {}) {
    const filter = { isActive: true, ...query };
    return await Category.find(filter).sort({ name: 1 });
  }

  async getCategoryById(id: string) {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError("Danh mục không tồn tại", 404);
    }
    return category;
  }

  async createCategory(data: Partial<ICategory>) {
    const { name, slug, parentId } = data;

    if (!name) {
      throw new AppError("Tên danh mục là bắt buộc", 400);
    }

    const categorySlug = slug || this.generateSlug(name);

    // Check unique name/slug
    const existing = await Category.findOne({
      $or: [{ name }, { slug: categorySlug }]
    });
    if (existing) {
      throw new AppError("Tên hoặc Slug danh mục đã tồn tại", 400);
    }

    // Verify parent if provided
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        throw new AppError("Danh mục cha không tồn tại", 400);
      }
    }

    return await Category.create({
      ...data,
      slug: categorySlug
    });
  }

  async updateCategory(id: string, data: Partial<ICategory>) {
    const category = await this.getCategoryById(id);
    const { name, slug, parentId } = data;

    if (name && name !== category.name) {
      const existing = await Category.findOne({ name });
      if (existing) {
        throw new AppError("Tên danh mục đã tồn tại", 400);
      }
      category.name = name;
    }

    if (slug && slug !== category.slug) {
      const existing = await Category.findOne({ slug });
      if (existing) {
        throw new AppError("Slug danh mục đã tồn tại", 400);
      }
      category.slug = slug;
    } else if (name && name !== category.name && !slug) {
      category.slug = this.generateSlug(name);
    }

    if (parentId !== undefined) {
      if (parentId === id) {
        throw new AppError("Danh mục cha không thể chính là nó", 400);
      }
      if (parentId) {
        const parent = await Category.findById(parentId);
        if (!parent) {
          throw new AppError("Danh mục cha không tồn tại", 400);
        }
      }
      category.parentId = parentId;
    }

    if (data.description !== undefined) category.description = data.description;
    if (data.image !== undefined) category.image = data.image;
    if (data.isActive !== undefined) category.isActive = data.isActive;

    return await category.save();
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);

    // Check if category has subcategories
    const hasChildren = await Category.findOne({ parentId: id });
    if (hasChildren) {
      throw new AppError("Không thể xóa danh mục đang có danh mục con", 400);
    }

    // Note: We could check for active products using categoryId here too.
    await category.deleteOne();
    return { message: "Xóa danh mục thành công" };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
}

export default new CategoryService();
