import userRepository from "../repositories/user.repository.js";
import { type IUser } from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { ObjectId } from "mongoose";

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

  async deleteUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return await userRepository.delete(id);
  }
}

export default new UserService();
