import Product, { IProduct } from "../models/product.model.js";
import FlashSaleItem from "../models/flashSaleItem.model.js";
import Category from "../models/category.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { uploadImage, deleteImage, deleteImages } from "../utils/uploadImage.js";
import { getFolder } from "../config/cloudinary.js";

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
      throw new AppError("San pham khong ton tai", 404);
    }
    return product;
  }

  async createProduct(userId: string, userRole: string, data: Partial<IProduct>) {
    const { name, categoryId, price } = data;

    if (!name || !categoryId || price === undefined) {
      throw new AppError("Vui long cung cap day du: Ten, Cua hang, Danh muc va Gia san pham", 400);
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new AppError("Danh muc san pham khong ton tai", 400);
    }


    const slug = `${this.generateSlug(name)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return await Product.create({
      ...data,
      slug
    });
  }

  async updateProduct(userId: string, userRole: string, id: string, data: Partial<IProduct>) {
    const product = await this.getProductById(id);


    const { name } = data;
    if (name && name !== product.name) {
      product.name = name;
      product.slug = `${this.generateSlug(name)}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    if (data.categoryId) {
      const categoryExists = await Category.findById(data.categoryId);
      if (!categoryExists) {
        throw new AppError("Danh muc moi khong ton tai", 400);
      }
      product.categoryId = data.categoryId;
    }

    if (data.price !== undefined) product.price = data.price;
    if (data.discountPrice !== undefined) product.discountPrice = data.discountPrice;
    if (data.description !== undefined) product.description = data.description;
    if (data.stock !== undefined) product.stock = data.stock;
    if (data.images !== undefined) product.images = data.images;
    if (data.specifications !== undefined) product.specifications = data.specifications;
    if (data.status !== undefined) product.status = data.status;
    if (data.isDeleted !== undefined) product.isDeleted = data.isDeleted;

    return await product.save();
  }

  async deleteProduct(userId: string, userRole: string, id: string) {
    const product = await this.getProductById(id);
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();
    return { message: "Xoa san pham thanh cong" };
  }

  async hardDeleteProduct(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("San pham khong ton tai", 404);
    }

    const allImages = Array.isArray(product.images) ? product.images : [];
    await deleteImages(allImages);

    await product.deleteOne();
    return { message: "Da xoa san pham vinh vien" };
  }

  async uploadProductImage(file: Express.Multer.File, productId: string, userId: string, userRole: string): Promise<string> {
    const product = await this.getProductById(productId);

    const { secure_url } = await uploadImage(file, getFolder.product(productId).images);

    const currentImages = Array.isArray(product.images) ? product.images : [];
    product.images = [...currentImages, secure_url];
    await product.save();
    return secure_url;
  }

  async uploadProductImages(files: Express.Multer.File[], productId: string, userId: string, userRole: string): Promise<string[]> {
    const product = await this.getProductById(productId);

    const urls: string[] = [];
    for (const file of files) {
      const { secure_url } = await uploadImage(file, getFolder.product(productId).gallery);
      urls.push(secure_url);
    }

    const currentImages = Array.isArray(product.images) ? product.images : [];
    product.images = [...currentImages, ...urls];
    await product.save();
    return urls;
  }

  async removeProductImage(productId: string, imageUrl: string, userId: string, userRole: string) {
    const product = await this.getProductById(productId);

    await deleteImage(imageUrl);

    if (Array.isArray(product.images)) {
      product.images = product.images.filter((img: string) => img !== imageUrl);
    }
    await product.save();

    return { message: "Da xoa anh san pham" };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/d/g, "d")
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
