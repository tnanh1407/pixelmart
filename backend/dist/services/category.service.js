import Category from "../models/category.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import cloudinary, { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";
class CategoryService {
    async getCategories(query = {}) {
        const { page, limit, search, isActive } = query;
        const filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === "true" || isActive === true;
        }
        else {
            // By default, only show active categories.
            // But if page or limit is passed (e.g. from admin panel), show both active and inactive.
            if (page === undefined && limit === undefined) {
                filter.isActive = true;
            }
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
        if (page !== undefined || limit !== undefined) {
            const p = page ? Number(page) : 1;
            const l = limit ? Number(limit) : 10;
            const skipIndex = (p - 1) * l;
            const categories = await Category.find(filter)
                .sort({ name: 1 })
                .skip(skipIndex)
                .limit(l);
            const total = await Category.countDocuments(filter);
            return {
                categories,
                pagination: {
                    page: p,
                    limit: l,
                    total,
                    totalPages: Math.ceil(total / l),
                }
            };
        }
        return await Category.find(filter).sort({ name: 1 });
    }
    async getCategoryById(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new AppError("Danh mục không tồn tại", 404);
        }
        return category;
    }
    async createCategory(data) {
        const { name, slug } = data;
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
        return await Category.create({
            ...data,
            slug: categorySlug
        });
    }
    async updateCategory(id, data) {
        const category = await this.getCategoryById(id);
        const { name, slug } = data;
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
        }
        else if (name && name !== category.name && !slug) {
            category.slug = this.generateSlug(name);
        }
        if (data.description !== undefined)
            category.description = data.description;
        if (data.image !== undefined)
            category.image = data.image;
        if (data.isActive !== undefined)
            category.isActive = data.isActive;
        return await category.save();
    }
    async deleteCategory(id) {
        await this.getCategoryById(id);
        await Category.findByIdAndDelete(id);
        return { message: "Xóa danh mục thành công" };
    }
    async uploadCategoryImage(file) {
        const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: CLOUDINARY_FOLDERS.CATEGORIES,
        });
        return result.secure_url;
    }
    generateSlug(name) {
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
