import Store, { IStore } from "../models/store.model.js";
import StoreFollow from "../models/storeFollow.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { uploadImage, deleteImage } from "../utils/uploadImage.js";
import { getFolder } from "../config/cloudinary.js";

class StoreService {
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
      .populate("ownerId", "name email");

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
    const store = await Store.findById(id).populate("ownerId", "name email");
    if (!store) {
      throw new AppError("Cua hang khong ton tai", 404);
    }
    return store;
  }

  async getStoreByOwnerId(ownerId: string) {
    return await Store.findOne({ ownerId });
  }

  async createStore(userId: string, userRole: string, data: Partial<IStore>) {
    const { name, slug } = data;

    if (!name) {
      throw new AppError("Ten cua hang la bat buoc", 400);
    }

    let targetOwnerId = userId;
    if (userRole === "admin" && data.ownerId) {
      targetOwnerId = data.ownerId;
    }

    if (!targetOwnerId) {
      throw new AppError("Khong xac dinh duoc chu so huu cua hang", 400);
    }

    const existingOwns = await Store.findOne({ ownerId: targetOwnerId });
    if (existingOwns) {
      throw new AppError("Moi tai khoan chi co the so huu 1 cua hang", 400);
    }

    const storeSlug = slug || this.generateSlug(name);

    const existingName = await Store.findOne({
      $or: [{ name }, { slug: storeSlug }]
    });
    if (existingName) {
      throw new AppError("Ten hoac Slug cua hang da ton tai", 400);
    }

    return await Store.create({
      ...data,
      ownerId: targetOwnerId,
      slug: storeSlug
    });
  }

  async updateStore(userId: string, userRole: string, id: string, data: Partial<IStore>) {
    const store = await this.getStoreById(id);

    if (userRole !== "admin" && store.ownerId !== userId) {
      throw new AppError("Ban khong co quyen chinh sua cua hang nay", 403);
    }

    const { name, slug } = data;

    if (name && name !== store.name) {
      const existing = await Store.findOne({ name });
      if (existing) {
        throw new AppError("Ten cua hang da ton tai", 400);
      }
      store.name = name;
    }

    if (slug && slug !== store.slug) {
      const existing = await Store.findOne({ slug });
      if (existing) {
        throw new AppError("Slug cua hang da ton tai", 400);
      }
      store.slug = slug;
    } else if (name && name !== store.name && !slug) {
      store.slug = this.generateSlug(name);
    }

    if (data.logo !== undefined) store.logo = data.logo;
    if (data.description !== undefined) store.description = data.description;
    if (data.phone !== undefined) store.phone = data.phone;
    if (data.email !== undefined) store.email = data.email;
    if (data.street !== undefined) store.street = data.street;
    if (data.provinceCode !== undefined) store.provinceCode = data.provinceCode;
    if (data.districtCode !== undefined) store.districtCode = data.districtCode;
    if (data.wardCode !== undefined) store.wardCode = data.wardCode;
    if (data.policies !== undefined) store.policies = data.policies;

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
          throw new AppError("Moi tai khoan chi co the so huu 1 cua hang", 400);
        }
        store.ownerId = data.ownerId;
      }
    }

    return await store.save();
  }

  async deleteStore(userId: string, userRole: string, id: string) {
    const store = await this.getStoreById(id);

    if (userRole !== "admin" && store.ownerId !== userId) {
      throw new AppError("Ban khong co quyen xoa cua hang nay", 403);
    }

    await store.deleteOne();
    return { message: "Xoa cua hang thanh cong" };
  }

  async followStore(userId: string, storeId: string) {
    const store = await this.getStoreById(storeId);

    if (store.ownerId === userId) {
      throw new AppError("Ban khong the theo doi cua hang cua minh", 400);
    }

    const existing = await StoreFollow.findOne({ userId, storeId });
    if (existing) {
      throw new AppError("Ban da theo doi cua hang nay roi", 400);
    }

    await StoreFollow.create({ userId, storeId });

    return { message: "Theo doi cua hang thanh cong", isFollowing: true };
  }

  async unfollowStore(userId: string, storeId: string) {
    const existing = await StoreFollow.findOneAndDelete({ userId, storeId });
    if (!existing) {
      throw new AppError("Ban chua theo doi cua hang nay", 400);
    }

    return { message: "Bo theo doi cua hang thanh cong", isFollowing: false };
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
      .replace(/d/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async uploadStoreLogo(file: Express.Multer.File, storeId: string, userId: string, userRole: string): Promise<string> {
    const store = await this.getStoreById(storeId);

    if (userRole !== "admin" && store.ownerId !== userId) {
      throw new AppError("Ban khong co quyen cap nhat cua hang nay", 403);
    }

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

    if (userRole !== "admin" && store.ownerId !== userId) {
      throw new AppError("Ban khong co quyen cap nhat cua hang nay", 403);
    }

    if (store.logo) {
      await deleteImage(store.logo);
      store.logo = undefined as any;
      await store.save();
    }

    return { message: "Da xoa logo cua hang" };
  }
}

export default new StoreService();
