import { type Request, type Response } from "express";
import userService from "../services/user.service.js";
import { updateUserSchema } from "../validators/user.validator.js";

class UserController {
  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const user = await userService.getUserById(id);
    res.json({
      success: true,
      data: user,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, sort, ...filter } = req.query;
    const result = await userService.getAllUsers(filter, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sort: sort as string,
    });
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  }

  async update(req: Request, res: Response) {
    const data = updateUserSchema.parse(req.body);
    const id = String(req.params.id);
    const user = await userService.updateUser(id, data);
    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);
    await userService.deleteUser(id);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  }
}

export default new UserController();
