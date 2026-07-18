import Product, { IProduct } from "../models/product.model.js";
import FlashSaleItem from "../models/flashSaleItem.model.js";
import Store from "../models/store.model.js";
import Vendor from "../models/vendor.model.js";
import Category from "../models/category.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { uploadImage, deleteImage, deleteImages } from "../utils/uploadImage.js";
import { getFolder } from "../config/cloudinary.js";

class ProductService {
  private async getVendorId(userId: string, userRole: string): Promise<string | null> {
    if (userRole === "admin") return null;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new AppError("Bạn chưa đăng ký trở thành người bán", 403);
    }
    if (vendor.status !== "approved") {
      throw new AppError("Tài khoản người bán của bạn chưa được duyệt hoặc đã bị khóa", 403);
    }
    return String(vendor._id);
  }
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

    const filter: any = { isDeleted: false, status: "published" };

    if (search) {
      const regex = { $regex: search, $options: "i" };
      filter.$or = [
        { name: regex },
        { description: regex },
      ];
    }

    if (categoryId) {
      filter.categoryId = categoryId;
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
      const flashProductIds = await FlashSaleItem.distinct("productId", {
        flashSaleId: {
          $in: await getActiveFlashSaleIds(now),
        },
        flashStock: { $gt: 0 },
      });
      filter._id = { $in: flashProductIds };
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    let sorting: any = { createdAt: -1 };

    if (sort) {
      if (sort === "priceAsc") sorting = { price: 1 };
      else if (sort === "priceDesc") sorting = { price: -1 };
      else if (sort === "rating") sorting = { ratingsAverage: -1 };
      else if (sort === "sold") sorting = { soldCount: -1 };
      else if (sort === "createdAt") sorting = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .populate("categoryId", "name slug")
      .populate("storeId", "name slug logo isVerified")
      .sort(sorting)
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

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new AppError("Danh mục sản phẩm không tồn tại", 400);
    }

    const store = await Store.findById(storeId);
    if (!store) {
      throw new AppError("Cửa hàng không tồn tại", 400);
    }

    // Check vendor ownership
    if (userRole !== "admin") {
      const vendorId = await this.getVendorId(userId, userRole);
      if (!vendorId || store.ownerId !== vendorId) {
        throw new AppError("Bạn không phải là chủ sở hữu của cửa hàng này", 403);
      }
    }

    const slug = `${this.generateSlug(name)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return await Product.create({
      ...data,
      slug
    });
  }

  async updateProduct(userId: string, userRole: string, id: string, data: Partial<IProduct>) {
    const product = await this.getProductById(id);

    const store = await Store.findById(product.storeId);
    if (!store) {
      throw new AppError("Cửa hàng của sản phẩm này không khả dụng", 400);
    }

    // Check vendor ownership for this product's store
    if (userRole !== "admin") {
      const vendorId = await this.getVendorId(userId, userRole);
      if (!vendorId || store.ownerId !== vendorId) {
        throw new AppError("Bạn không có quyền chỉnh sửa sản phẩm này", 403);
      }
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
    if (data.gallery !== undefined) product.gallery = data.gallery;
    if (data.tags !== undefined) product.tags = data.tags;
    if (data.specifications !== undefined) product.specifications = data.specifications;
    if (data.weight !== undefined) product.weight = data.weight;
    if (data.dimensions !== undefined) product.dimensions = data.dimensions;
    if (data.isFeatured !== undefined && userRole === "admin") product.isFeatured = data.isFeatured;
    if (data.status !== undefined) product.status = data.status;
    if (data.isDeleted !== undefined) product.isDeleted = data.isDeleted;

    return await product.save();
  }

  async deleteProduct(userId: string, userRole: string, id: string) {
    const product = await this.getProductById(id);

    const store = await Store.findById(product.storeId);
    if (!store) {
      throw new AppError("Cửa hàng của sản phẩm này không khả dụng", 400);
    }

    if (userRole !== "admin") {
      const vendorId = await this.getVendorId(userId, userRole);
      if (!vendorId || store.ownerId !== vendorId) {
        throw new AppError("Bạn không có quyền xóa sản phẩm này", 403);
      }
    }

    // Soft delete: giữ lại ảnh trên Cloudinary
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();
    return { message: "Xóa sản phẩm thành công" };
  }

  async hardDeleteProduct(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    // Xóa tất cả ảnh trên Cloudinary
    await deleteImages([...product.images, ...(product.gallery || [])]);

    await product.deleteOne();
    return { message: "Đã xóa sản phẩm vĩnh viễn" };
  }

  async uploadProductImage(file: Express.Multer.File, productId: string, userId: string, userRole: string): Promise<string> {
    const product = await this.getProductById(productId);
    const store = await Store.findById(product.storeId);
    if (!store || (store.ownerId !== userId && userRole !== "admin")) {
      throw new AppError("Bạn không có quyền cập nhật sản phẩm này", 403);
    }

    const { secure_url } = await uploadImage(file, getFolder.product(productId).images);
    product.images.push(secure_url);
    await product.save();
    return secure_url;
  }

  async uploadProductImages(files: Express.Multer.File[], productId: string, userId: string, userRole: string): Promise<string[]> {
    const product = await this.getProductById(productId);
    const store = await Store.findById(product.storeId);
    if (!store || (store.ownerId !== userId && userRole !== "admin")) {
      throw new AppError("Bạn không có quyền cập nhật sản phẩm này", 403);
    }

    const urls: string[] = [];
    for (const file of files) {
      const { secure_url } = await uploadImage(file, getFolder.product(productId).gallery);
      urls.push(secure_url);
    }

    product.gallery = [...(product.gallery || []), ...urls];
    await product.save();
    return urls;
  }

  async removeProductImage(productId: string, imageUrl: string, userId: string, userRole: string) {
    const product = await this.getProductById(productId);
    const store = await Store.findById(product.storeId);
    if (!store || (store.ownerId !== userId && userRole !== "admin")) {
      throw new AppError("Bạn không có quyền cập nhật sản phẩm này", 403);
    }

    await deleteImage(imageUrl);

    // Remove from images array
    product.images = product.images.filter((img) => img !== imageUrl);
    // Remove from gallery if exists
    product.gallery = (product.gallery || []).filter((img) => img !== imageUrl);
    await product.save();

    return { message: "Đã xóa ảnh sản phẩm" };
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

async function getActiveFlashSaleIds(now: Date): Promise<string[]> {
  const FlashSale = (await import("../models/flashSale.model.js")).default;
  const sales = await FlashSale.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).select("_id");
  return sales.map((s: any) => s._id);
}

export default new ProductService();
