import userRepository from "../repositories/user.repository.js";
import { AppError } from "../middlewares/error.middleware.js";
class UserService {
    async createUser(data) {
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
    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return user;
    }
    async getAllUsers(filter = {}, options = {}) {
        return await userRepository.findAll(filter, options);
    }
    async updateUser(id, data) {
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
    async deleteUser(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return await userRepository.delete(id);
    }
}
export default new UserService();
