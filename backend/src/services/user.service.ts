import userRepository from "../repositories/user.repository.js";
import { type IUser, type IAddress } from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import cloudinary, { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";


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
      data.isPhoneVerified = false;
    }

    const updatedUser = await userRepository.update(id, data);
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
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

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.avatar && user.avatar.includes("cloudinary")) {
      const parts = user.avatar.split("/");
      const filename = parts[parts.length - 1];
      const publicId = filename.split(".")[0];
      await cloudinary.uploader.destroy(`${CLOUDINARY_FOLDERS.AVATARS}/${publicId}`);
    }

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: CLOUDINARY_FOLDERS.AVATARS,
      public_id: userId,
      format: "webp",
      overwrite: true,
      transformation: [
        { width: 256, height: 256, crop: "fill", quality: "auto" },
      ],
    });

    const updatedUser = await userRepository.update(userId, { avatar: result.secure_url });
    return updatedUser;
  }

  async addAddress(userId: string, addressData: Partial<IAddress>) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    const isDefault = addressData.isDefault || user.addresses.length === 0;

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      ...addressData,
      isDefault,
    } as IAddress;

    user.addresses.push(newAddress);
    await user.save();
    return user;
  }

  async updateAddress(userId: string, addressId: string, addressData: Partial<IAddress>) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    const address = user.addresses!.find((addr) => String(addr._id) === addressId);
    if (!address) {
      throw new AppError("Address not found", 404);
    }

    // Update fields
    Object.assign(address, addressData);

    // Handle isDefault logic
    if (addressData.isDefault) {
      user.addresses!.forEach((addr) => {
        if (String(addr._id) !== addressId) {
          addr.isDefault = false;
        }
      });
    } else {
      const defaults = user.addresses!.filter(addr => addr.isDefault);
      if (defaults.length === 0 && user.addresses!.length > 0) {
        user.addresses![0].isDefault = true;
      }
    }

    await user.save();
    return user;
  }

  async deleteAddress(userId: string, addressId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    const initialLength = user.addresses!.length;
    user.addresses = user.addresses!.filter((addr) => String(addr._id) !== addressId) as any;

    if (user.addresses!.length === initialLength) {
      throw new AppError("Address not found", 404);
    }

    const hasDefault = user.addresses!.some(addr => addr.isDefault);
    if (!hasDefault && user.addresses!.length > 0) {
      user.addresses![0].isDefault = true;
    }

    await user.save();
    return user;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    const address = user.addresses!.find((addr) => String(addr._id) === addressId);
    if (!address) {
      throw new AppError("Address not found", 404);
    }

    user.addresses!.forEach((addr) => {
      addr.isDefault = String(addr._id) === addressId;
    });

    await user.save();
    return user;
  }
}

export default new UserService();
