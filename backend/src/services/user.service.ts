import userRepository from "../repositories/user.repository.js";
import { type IUser } from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import cloudinary, { CLOUDINARY_FOLDERS, getUserFolder } from "../config/cloudinary.js";
import { extractPublicId } from "../utils/cloudinary/cloudinaryHelps.js";

class UserService {
  async createUser(data: Partial<IUser>) {
    const existingEmail = await userRepository.exists({ email: data.email });
    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }

    if (data.phone) {
      const existingPhone = await userRepository.exists({ phone: data.phone });
      if (existingPhone) {
        throw new AppError("Phone already exists", 409);
      }
    }

    return await userRepository.create(data);
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getAllUsers(
    filter: Partial<IUser> = {},
    options: { page?: number; limit?: number; sort?: string } = {}
  ) {
    return await userRepository.findAll(filter, options);
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await userRepository.exists({ email: data.email });
      if (existingEmail) {
        throw new AppError("Email already exists", 409);
      }
    }

    if (data.phone && data.phone !== user.phone) {
      const existingPhone = await userRepository.exists({ phone: data.phone });
      if (existingPhone) {
        throw new AppError("Phone already exists", 409);
      }
    }

    const updatedUser = await userRepository.update(id, data);
    return updatedUser;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await userRepository.findById(userId);
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

    const updatedUser = await userRepository.update(userId, { avatar: result.secure_url });
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await userRepository.findById(id);
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

    return await userRepository.delete(id);
  }

  async toggleActive(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await userRepository.update(id, { isActive: !user.isActive });
    return updatedUser;
  }
}

export default new UserService();
