import Product, { IProduct } from "../models/product.model.js";
import Store from "../models/store.model.js";
import Category from "../models/category.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class ProductService {
  async getProducts(query: any = {}) {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      storeId,
      minPrice,
      maxPrice,
      isFeatured,
      flashSaleActive,
      sort
    } = query;

    const filter: any = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (categoryId) {
      // Find subcategories if any to filter recursively
      const subCates = await Category.find({ parentId: categoryId });
      const cateIds = [categoryId, ...subCates.map(c => c._id)];
      filter.categoryId = { $in: cateIds };
    }

    if (storeId) {
      filter.storeId = storeId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (flashSaleActive === "true" || flashSaleActive === true) {
      const now = new Date();
      filter["flashSale.startDate"] = { $lte: now };
      filter["flashSale.endDate"] = { $gte: now };
      filter["flashSale.stock"] = { $gt: 0 };
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    let sorting: any = { createdAt: -1 };

    if (sort) {
      if (sort === "priceAsc") sorting = { price: 1 };
      else if (sort === "priceDesc") sorting = { price: -1 };
      else if (sort === "rating") sorting = { ratingsAverage: -1 };
      else if (sort === "sold") sorting = { ratingsQuantity: -1 }; // assuming orders/sales count is ratingQuantity or reviews
    }

    const products = await Product.find(filter)
      .populate("categoryId", "name slug")
      .populate("storeId", "name slug logo isVerified")
      .sort(search && !sort ? { score: { $meta: "textScore" } } : sorting)
      .skip(skipIndex)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getProductById(id: string) {
    const product = await Product.findById(id)
      .populate("categoryId")
      .populate("storeId");
    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }
    return product;
  }

  async createProduct(userId: string, userRole: string, data: Partial<IProduct>) {
    const { name, storeId, categoryId, price } = data;

    if (!name || !storeId || !categoryId || price === undefined) {
      throw new AppError("Vui lòng cung cấp đầy đủ: Tên, Cửa hàng, Danh mục và Giá sản phẩm", 400);
    }

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new AppError("Danh mục sản phẩm không tồn tại", 400);
    }

    // Verify store exists and belongs to the user
    const store = await Store.findById(storeId);
    if (!store) {
      throw new AppError("Cửa hàng không tồn tại", 400);
    }

    if (store.ownerId !== userId && userRole !== "admin") {
      throw new AppError("Bạn không phải là chủ sở hữu của cửa hàng này", 403);
    }

    const slug = `${this.generateSlug(name)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return await Product.create({
      ...data,
      slug
    });
  }

  async updateProduct(userId: string, userRole: string, id: string, data: Partial<IProduct>) {
    const product = await this.getProductById(id);

    // Verify store ownership of the product
    const store = await Store.findById(product.storeId);
    if (!store) {
      throw new AppError("Cửa hàng của sản phẩm này không khả dụng", 400);
    }

    if (store.ownerId !== userId && userRole !== "admin") {
      throw new AppError("Bạn không có quyền chỉnh sửa sản phẩm này", 403);
    }

    const { name } = data;
    if (name && name !== product.name) {
      product.name = name;
      product.slug = `${this.generateSlug(name)}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    if (data.categoryId) {
      const categoryExists = await Category.findById(data.categoryId);
      if (!categoryExists) {
        throw new AppError("Danh mục mới không tồn tại", 400);
      }
      product.categoryId = data.categoryId;
    }

    if (data.price !== undefined) product.price = data.price;
    if (data.discountPrice !== undefined) product.discountPrice = data.discountPrice;
    if (data.description !== undefined) product.description = data.description;
    if (data.shortDescription !== undefined) product.shortDescription = data.shortDescription;
    if (data.stock !== undefined) product.stock = data.stock;
    if (data.images !== undefined) product.images = data.images;
    if (data.specifications !== undefined) product.specifications = data.specifications;
    if (data.isFeatured !== undefined && userRole === "admin") product.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) product.isActive = data.isActive;
    if (data.flashSale !== undefined) product.flashSale = data.flashSale;

    return await product.save();
  }

  async deleteProduct(userId: string, userRole: string, id: string) {
    const product = await this.getProductById(id);

    // Verify store ownership
    const store = await Store.findById(product.storeId);
    if (!store) {
      throw new AppError("Cửa hàng của sản phẩm này không khả dụng", 400);
    }

    if (store.ownerId !== userId && userRole !== "admin") {
      throw new AppError("Bạn không có quyền xóa sản phẩm này", 403);
    }

    await product.deleteOne();
    return { message: "Xóa sản phẩm thành công" };
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

export default new ProductService();
