import userService from "../services/user.service.js";
import { updateUserSchema } from "../validators/user.validator.js";
class UserController {
    async getById(req, res) {
        const id = String(req.params.id);
        const user = await userService.getUserById(id);
        res.json({
            success: true,
            data: user,
        });
    }
    async getAll(req, res) {
        const { page, limit, sort, search, ...filter } = req.query;
        const mongoFilter = { ...filter };
        if (search) {
            mongoFilter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        const result = await userService.getAllUsers(mongoFilter, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            sort: sort,
        });
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    }
    async update(req, res) {
        const data = updateUserSchema.parse(req.body);
        const id = String(req.params.id);
        const user = await userService.updateUser(id, data);
        res.json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    }
    async delete(req, res) {
        const id = String(req.params.id);
        await userService.deleteUser(id);
        res.json({
            success: true,
            message: "User deleted successfully",
        });
    }
    async toggleActive(req, res) {
        const id = String(req.params.id);
        const user = await userService.toggleActive(id);
        res.json({
            success: true,
            message: `User ${user?.isActive ? "activated" : "deactivated"} successfully`,
            data: user,
        });
    }
    async updateProfile(req, res) {
        const id = String(req.user?.userId);
        const file = req.file;
        let data = {};
        if (req.body.data) {
            try {
                data = JSON.parse(req.body.data);
            }
            catch {
                data = req.body;
            }
        }
        else {
            data = req.body;
        }
        let user;
        if (Object.keys(data).length > 0) {
            user = await userService.updateUser(id, data);
        }
        if (file) {
            user = await userService.uploadAvatar(id, file);
        }
        if (!user) {
            user = await userService.getUserById(id);
        }
        res.json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    }
}
export default new UserController();
