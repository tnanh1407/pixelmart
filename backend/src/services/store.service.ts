import Store, { IStore } from "../models/store.model.js";
import StoreFollow from "../models/storeFollow.model.js";
import Vendor from "../models/vendor.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { uploadImage, deleteImage } from "../utils/uploadImage.js";
import { getFolder } from "../config/cloudinary.js";

class StoreService {
  private async getVendorId(userId: string, userRole: string): Promise<string | null> {
    if (userRole === "admin") return null;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new AppError("Bạn chưa đăng ký trở thành người bán. Vui lòng đăng ký tài khoản Vendor.", 403);
    }
    if (vendor.status !== "approved") {
      throw new AppError("Tài khoản người bán của bạn chưa được duyệt hoặc đã bị khóa", 403);
    }
    return String(vendor._id);
  }
  async getStores(query: any = {}) {
    const { page = 1, limit = 10, search, isVerified, isActive, all } = query;
    const filter: any = {};

    if (all !== "true" && all !== true) {
      filter.isActive = true;
    } else if (isActive !== undefined) {
      filter.isActive = isActive === "true" || isActive === true;
    }

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
      .limit(Number(limit))
      .populate("ownerId", "shopName email");

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
    const store = await Store.findById(id).populate("ownerId", "shopName email");
    if (!store) {
      throw new AppError("Cửa hàng không tồn tại", 404);
    }
    return store;
  }

  async getStoreByOwnerId(ownerId: string) {
    return await Store.findOne({ ownerId });
  }

  async createStore(userId: string, userRole: string, data: Partial<IStore>) {
    const { name, slug } = data;

    if (!name) {
      throw new AppError("Tên cửa hàng là bắt buộc", 400);
    }

    let targetOwnerId = await this.getVendorId(userId, userRole);
    if (userRole === "admin" && data.ownerId) {
      targetOwnerId = data.ownerId;
    }

    if (!targetOwnerId) {
      throw new AppError("Không xác định được chủ sở hữu cửa hàng", 400);
    }

    // Check if user already owns a store
    const existingOwns = await Store.findOne({ ownerId: targetOwnerId });
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
      ownerId: targetOwnerId,
      slug: storeSlug
    });
  }

  async updateStore(userId: string, userRole: string, id: string, data: Partial<IStore>) {
    const store = await this.getStoreById(id);

    // Verify permission: Only owner vendor or admin
    if (userRole !== "admin") {
      const vendorId = await this.getVendorId(userId, userRole);
      if (!vendorId || store.ownerId !== vendorId) {
        throw new AppError("Bạn không có quyền chỉnh sửa cửa hàng này", 403);
      }
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
    if (data.description !== undefined) store.description = data.description;
    if (data.phone !== undefined) store.phone = data.phone;
    if (data.email !== undefined) store.email = data.email;
    if (data.address !== undefined) store.address = data.address;
    if (data.policies !== undefined) store.policies = data.policies;
    
    // Only admin can verify / activate store and change owner
    if (userRole === "admin") {
      if (data.isVerified !== undefined) {
        store.isVerified = data.isVerified;
      }
      if (data.isActive !== undefined) {
        store.isActive = data.isActive;
      }
      if (data.ownerId !== undefined && data.ownerId !== store.ownerId) {
        const existingOwns = await Store.findOne({ ownerId: data.ownerId });
        if (existingOwns && existingOwns._id.toString() !== id) {
          throw new AppError("Mỗi tài khoản chỉ có thể sở hữu 1 cửa hàng", 400);
        }
        store.ownerId = data.ownerId;
      }
    }

    return await store.save();
  }

  async deleteStore(userId: string, userRole: string, id: string) {
    const store = await this.getStoreById(id);

    // Verify permission: Only owner vendor or admin
    if (userRole !== "admin") {
      const vendorId = await this.getVendorId(userId, userRole);
      if (!vendorId || store.ownerId !== vendorId) {
        throw new AppError("Bạn không có quyền xóa cửa hàng này", 403);
      }
    }

    await store.deleteOne();
    return { message: "Xóa cửa hàng thành công" };
  }

  async followStore(userId: string, storeId: string) {
    const store = await this.getStoreById(storeId);

    // Check if user is trying to follow their own store
    const vendor = await Vendor.findOne({ userId });
    if (vendor && store.ownerId === vendor._id.toString()) {
      throw new AppError("Bạn không thể theo dõi cửa hàng của mình", 400);
    }

    const existing = await StoreFollow.findOne({ userId, storeId });
    if (existing) {
      throw new AppError("Bạn đã theo dõi cửa hàng này rồi", 400);
    }

    await StoreFollow.create({ userId, storeId });

    return { message: "Theo dõi cửa hàng thành công", isFollowing: true };
  }

  async unfollowStore(userId: string, storeId: string) {
    const existing = await StoreFollow.findOneAndDelete({ userId, storeId });
    if (!existing) {
      throw new AppError("Bạn chưa theo dõi cửa hàng này", 400);
    }

    return { message: "Bỏ theo dõi cửa hàng thành công", isFollowing: false };
  }

  async checkFollowStatus(userId: string, storeId: string) {
    const existing = await StoreFollow.findOne({ userId, storeId });
    return { isFollowing: !!existing };
  }

  async getFollowedStores(userId: string, query: any = {}) {
    const { page = 1, limit = 20 } = query;
    const skipIndex = (Number(page) - 1) * Number(limit);

    const follows = await StoreFollow.find({ userId })
      .populate("storeId")
      .skip(skipIndex)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await StoreFollow.countDocuments({ userId });

    return {
      stores: follows.map((f) => f.storeId).filter(Boolean),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getStoreFollowers(storeId: string, query: any = {}) {
    const { page = 1, limit = 20 } = query;
    const skipIndex = (Number(page) - 1) * Number(limit);

    const follows = await StoreFollow.find({ storeId })
      .populate("userId", "name email avatar")
      .skip(skipIndex)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await StoreFollow.countDocuments({ storeId });

    return {
      followers: follows.map((f) => f.userId).filter(Boolean),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
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

  async uploadStoreLogo(file: Express.Multer.File, storeId: string, userId: string, userRole: string): Promise<string> {
    const store = await this.getStoreById(storeId);

    if (userRole !== "admin") {
      const vendor = await Vendor.findOne({ userId });
      if (!vendor || store.ownerId !== vendor._id.toString()) {
        throw new AppError("Bạn không có quyền cập nhật cửa hàng này", 403);
      }
    }

    // Delete old logo
    if (store.logo) {
      await deleteImage(store.logo);
    }

    const { secure_url } = await uploadImage(file, getFolder.store(storeId).logo);
    store.logo = secure_url;
    await store.save();
    return secure_url;
  }

  async deleteStoreLogo(storeId: string, userId: string, userRole: string) {
    const store = await this.getStoreById(storeId);

    if (userRole !== "admin") {
      const vendor = await Vendor.findOne({ userId });
      if (!vendor || store.ownerId !== vendor._id.toString()) {
        throw new AppError("Bạn không có quyền cập nhật cửa hàng này", 403);
      }
    }

    if (store.logo) {
      await deleteImage(store.logo);
      store.logo = undefined as any;
      await store.save();
    }

    return { message: "Đã xóa logo cửa hàng" };
  }
}

export default new StoreService();
