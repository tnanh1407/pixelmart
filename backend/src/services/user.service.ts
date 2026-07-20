import User, { type IUser } from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { hashPassword } from "../utils/bcrypt.js";
import cloudinary, { CLOUDINARY_FOLDERS, getUserFolder } from "../config/cloudinary.js";
import { extractPublicId } from "../utils/cloudinary/cloudinaryHelps.js";

class UserService {
  async createUser(data: Partial<IUser>) {
    const existing = await User.exists({ email: data.email });
    if (existing) {
      throw new AppError("Email already exists", 409);
    }

    if (data.phone) {
      const existingPhone = await User.exists({ phone: data.phone });
      if (existingPhone) {
        throw new AppError("Phone already exists", 409);
      }
    }

    return await User.create(data);
  }

  async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async getUserByEmailWithPassword(email: string) {
    return await User.findOne({ email }).select("+password");
  }

  async getUserByIdWithPassword(id: string) {
    return await User.findById(id).select("+password");
  }

  async getUserByGoogleId(googleId: string) {
    return await User.findOne({ googleId });
  }

  async getAllUsers(
    filter: Partial<IUser> = {},
    options: { page?: number; limit?: number; sort?: string } = {}
  ) {
    const { page = 1, limit = 10, sort = "-createdAt" } = options;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== user.email) {
      const existing = await User.exists({ email: data.email });
      if (existing) {
        throw new AppError("Email already exists", 409);
      }
    }

    if (data.phone && data.phone !== user.phone) {
      const existing = await User.exists({ phone: data.phone });
      if (existing) {
        throw new AppError("Phone already exists", 409);
      }
    }

    return await User.findByIdAndUpdate(id, data, { returnDocument: "after" });
  }

  async updatePassword(id: string, password: string) {
    const hashed = await hashPassword(password);
    return await User.findByIdAndUpdate(id, { password: hashed }, { returnDocument: "after" });
  }

  async updateEmailVerified(id: string, isEmailVerified: boolean) {
    return await User.findByIdAndUpdate(id, { isEmailVerified }, { returnDocument: "after" });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const userFolders = getUserFolder(userId);

    if (user.avatar && user.avatar.includes("cloudinary")) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: userFolders.avatars,
      public_id: "avatar",
      format: "webp",
      overwrite: true,
      transformation: [
        { width: 256, height: 256, crop: "fill", quality: "auto" },
      ],
    });

    return await User.findByIdAndUpdate(userId, { avatar: result.secure_url }, { returnDocument: "after" });
  }

  async deleteUser(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.avatar && user.avatar.includes("cloudinary")) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const userFolders = getUserFolder(id);
    try {
      await cloudinary.api.delete_folder(userFolders.avatars);
      await cloudinary.api.delete_folder(userFolders.reviews);
    } catch {
    }

    return await User.findByIdAndDelete(id);
  }

  async toggleActive(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return await User.findByIdAndUpdate(id, { isActive: !user.isActive }, { returnDocument: "after" });
  }
}

export default new UserService();
