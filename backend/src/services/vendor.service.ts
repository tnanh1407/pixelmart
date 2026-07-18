import Vendor, { IVendor } from "../models/vendor.model.js";
import User from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { uploadImage, deleteImage } from "../utils/uploadImage.js";
import { getFolder } from "../config/cloudinary.js";

class VendorService {
  async getVendors(query: any = {}) {
    const { page = 1, limit = 10, search, status } = query;
    const filter: any = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (status) {
      filter.status = status;
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const vendors = await Vendor.find(filter)
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit))
      .populate("userId", "name email avatar")
      .populate("approvedBy", "name email");

    const total = await Vendor.countDocuments(filter);

    return {
      vendors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getVendorById(id: string) {
    const vendor = await Vendor.findById(id)
      .populate("userId", "name email avatar")
      .populate("approvedBy", "name email");
    if (!vendor) {
      throw new AppError("Người bán không tồn tại", 404);
    }
    return vendor;
  }

  async getVendorByUserId(userId: string) {
    return await Vendor.findOne({ userId })
      .populate("userId", "name email avatar");
  }

  async approveVendor(adminId: string, vendorId: string) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new AppError("Người bán không tồn tại", 404);
    }

    if (vendor.status !== "pending") {
      throw new AppError("Chỉ có thể duyệt người bán đang ở trạng thái chờ duyệt", 400);
    }

    vendor.status = "approved";
    vendor.verifiedAt = new Date();
    vendor.approvedBy = adminId;
    vendor.rejectionReason = undefined;
    await vendor.save();

    return vendor;
  }

  async rejectVendor(adminId: string, vendorId: string, reason: string) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new AppError("Người bán không tồn tại", 404);
    }

    vendor.status = "rejected";
    vendor.rejectionReason = reason;
    vendor.approvedBy = adminId;
    vendor.verifiedAt = new Date();
    await vendor.save();

    return vendor;
  }

  async suspendVendor(adminId: string, vendorId: string, reason: string) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new AppError("Người bán không tồn tại", 404);
    }

    if (vendor.status !== "approved") {
      throw new AppError("Chỉ có thể khóa người bán đang hoạt động", 400);
    }

    vendor.status = "suspended";
    vendor.rejectionReason = reason;
    vendor.approvedBy = adminId;
    await vendor.save();

    return vendor;
  }

  async updateVendor(id: string, data: Partial<IVendor>) {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      throw new AppError("Người bán không tồn tại", 404);
    }

    const updatableFields = [
      "shopName", "businessName", "taxCode",
      "description", "email", "phone",
      "avatar", "banner", "identityNumber",
      "identityFront", "identityBack", "businessLicense",
      "bankName", "bankAccountNumber", "bankAccountHolder",
    ];

    for (const field of updatableFields) {
      if ((data as any)[field] !== undefined) {
        (vendor as any)[field] = (data as any)[field];
      }
    }

    await vendor.save();
    return vendor;
  }

  async getVendorStats() {
    const total = await Vendor.countDocuments();
    const approved = await Vendor.countDocuments({ status: "approved" });
    const pending = await Vendor.countDocuments({ status: "pending" });
    const rejected = await Vendor.countDocuments({ status: "rejected" });
    const suspended = await Vendor.countDocuments({ status: "suspended" });

    return {
      total,
      approved,
      pending,
      rejected,
      suspended,
    };
  }

  async uploadVendorImage(file: Express.Multer.File, vendorId: string, type: "avatar" | "banner" | "identityFront" | "identityBack" | "businessLicense"): Promise<string> {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new AppError("Người bán không tồn tại", 404);

    // Delete old image if exists
    const oldUrl = (vendor as any)[type] as string;
    if (oldUrl) await deleteImage(oldUrl);

    const folder = getFolder.vendor(vendorId)[
      type === "identityFront" || type === "identityBack" ? "identity" :
      type === "businessLicense" ? "license" : type
    ];

    const { secure_url } = await uploadImage(file, folder);
    (vendor as any)[type] = secure_url;
    await vendor.save();
    return secure_url;
  }

  async deleteVendorImage(vendorId: string, type: "avatar" | "banner" | "identityFront" | "identityBack" | "businessLicense") {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new AppError("Người bán không tồn tại", 404);

    const oldUrl = (vendor as any)[type] as string;
    if (oldUrl) {
      await deleteImage(oldUrl);
      (vendor as any)[type] = null;
      await vendor.save();
    }
    return { message: "Đã xóa ảnh" };
  }
}

export default new VendorService();
