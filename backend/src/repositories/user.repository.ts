import { hashPassword } from "~/utils/bcrypt.ts";
import User, { type IUser, type IUserDocument } from "../models/user.model.js";

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
}

interface PaginationResult {
  data: IUserDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class UserRepository {
  async create(data: Partial<IUser>): Promise<IUserDocument> {
    return await User.create(data);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email }).select("+password");
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return await User.findById(id);
  }

  async findByIdWithPassword(id: string): Promise<IUserDocument | null> {
    return await User.findById(id).select("+password");
  }

  async findByGoogleId(googleId: string): Promise<IUserDocument | null> {
    return await User.findOne({ googleId });
  }

  async findByPhone(phone: string): Promise<IUserDocument | null> {
    return await User.findOne({ phone });
  }

  async findAll(
    filter: Partial<IUser> = {},
    options: PaginationOptions = {}
  ): Promise<PaginationResult> {
    const { page = 1, limit = 10, sort = "-createdAt" } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    id: string,
    data: Partial<IUser>
  ): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(id, data, { returnDocument: "after" });
  }

  async updatePassword(id: string, password: string): Promise<IUserDocument | null> {
    const hashed = await hashPassword(password);
    return await User.findByIdAndUpdate(id, {password : hashed }, { returnDocument: "after" });
  }

  async updateEmailVerified(id: string, isEmailVerified: boolean): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(id, { isEmailVerified }, { returnDocument: "after" });
  }

  async delete(id: string): Promise<IUserDocument | null> {
    return await User.findByIdAndDelete(id);
  }

  async count(filter: Partial<IUser> = {}): Promise<number> {
    return await User.countDocuments(filter);
  }

  async exists(filter: Partial<IUser>): Promise<boolean> {
    const doc = await User.exists(filter);
    return doc !== null;
  }
}

export default new UserRepository();
