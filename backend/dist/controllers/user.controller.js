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
        const { page, limit, sort, ...filter } = req.query;
        const result = await userService.getAllUsers(filter, {
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
}
export default new UserController();
