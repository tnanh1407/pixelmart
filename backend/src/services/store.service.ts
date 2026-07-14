import Store, { IStore } from "../models/store.model.js";
import StoreFollow from "../models/storeFollow.model.js";
import { AppError } from "../middlewares/error.middleware.js";

class StoreService {
  async getStores(query: any = {}) {
    const { page = 1, limit = 10, search, isVerified } = query;
    const filter: any = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (isVerified !== undefined) {
      filter.isVerified = isVerified === "true" || isVerified === true;
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const stores = await Store.find(filter)
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    const total = await Store.countDocuments(filter);

    return {
      stores,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getStoreById(id: string) {
    const store = await Store.findById(id);
    if (!store) {
      throw new AppError("Cửa hàng không tồn tại", 404);
    }
    return store;
  }

  async getStoreByOwnerId(ownerId: string) {
    return await Store.findOne({ ownerId });
  }

  async createStore(ownerId: string, data: Partial<IStore>) {
    const { name, slug } = data;

    if (!name) {
      throw new AppError("Tên cửa hàng là bắt buộc", 400);
    }

    // Check if user already owns a store
    const existingOwns = await Store.findOne({ ownerId });
    if (existingOwns) {
      throw new AppError("Mỗi tài khoản chỉ có thể sở hữu 1 cửa hàng", 400);
    }

    const storeSlug = slug || this.generateSlug(name);

    // Check unique name/slug
    const existingName = await Store.findOne({
      $or: [{ name }, { slug: storeSlug }]
    });
    if (existingName) {
      throw new AppError("Tên hoặc Slug cửa hàng đã tồn tại", 400);
    }

    return await Store.create({
      ...data,
      ownerId,
      slug: storeSlug
    });
  }

  async updateStore(userId: string, userRole: string, id: string, data: Partial<IStore>) {
    const store = await this.getStoreById(id);

    // Verify permission: Only owner or admin
    if (store.ownerId !== userId && userRole !== "admin") {
      throw new AppError("Bạn không có quyền chỉnh sửa cửa hàng này", 403);
    }

    const { name, slug } = data;

    if (name && name !== store.name) {
      const existing = await Store.findOne({ name });
      if (existing) {
        throw new AppError("Tên cửa hàng đã tồn tại", 400);
      }
      store.name = name;
    }

    if (slug && slug !== store.slug) {
      const existing = await Store.findOne({ slug });
      if (existing) {
        throw new AppError("Slug cửa hàng đã tồn tại", 400);
      }
      store.slug = slug;
    } else if (name && name !== store.name && !slug) {
      store.slug = this.generateSlug(name);
    }

    if (data.logo !== undefined) store.logo = data.logo;
    if (data.coverImage !== undefined) store.coverImage = data.coverImage;
    if (data.description !== undefined) store.description = data.description;
    if (data.phone !== undefined) store.phone = data.phone;
    if (data.email !== undefined) store.email = data.email;
    
    // Only admin can verify store
    if (data.isVerified !== undefined && userRole === "admin") {
      store.isVerified = data.isVerified;
    }

    if (data.isActive !== undefined && userRole === "admin") {
      store.isActive = data.isActive;
    }

    return await store.save();
  }

  async deleteStore(userId: string, userRole: string, id: string) {
    const store = await this.getStoreById(id);

    // Verify permission: Only owner or admin
    if (store.ownerId !== userId && userRole !== "admin") {
      throw new AppError("Bạn không có quyền xóa cửa hàng này", 403);
    }

    await store.deleteOne();
    return { message: "Xóa cửa hàng thành công" };
  }

  async followStore(userId: string, storeId: string) {
    const store = await this.getStoreById(storeId);

    if (store.ownerId === userId) {
      throw new AppError("Bạn không thể theo dõi cửa hàng của mình", 400);
    }

    const existing = await StoreFollow.findOne({ userId, storeId });
    if (existing) {
      throw new AppError("Bạn đã theo dõi cửa hàng này rồi", 400);
    }

    await StoreFollow.create({ userId, storeId });
    await Store.findByIdAndUpdate(storeId, { $inc: { followersCount: 1 } });

    return { message: "Theo dõi cửa hàng thành công", isFollowing: true };
  }

  async unfollowStore(userId: string, storeId: string) {
    const existing = await StoreFollow.findOneAndDelete({ userId, storeId });
    if (!existing) {
      throw new AppError("Bạn chưa theo dõi cửa hàng này", 400);
    }

    await Store.findByIdAndUpdate(storeId, { $inc: { followersCount: -1 } });

    return { message: "Bỏ theo dõi cửa hàng thành công", isFollowing: false };
  }

  async checkFollowStatus(userId: string, storeId: string) {
    const existing = await StoreFollow.findOne({ userId, storeId });
    return { isFollowing: !!existing };
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

export default new StoreService();
