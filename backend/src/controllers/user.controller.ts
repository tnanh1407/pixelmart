import { type Request, type Response } from "express";
import userService from "../services/user.service.js";
import { updateUserSchema, updateProfileSchema } from "../validators/user.validator.js";

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
    const { page, limit, sort, search, ...filter } = req.query;
    const mongoFilter: any = { ...filter };
    if (search) {
      mongoFilter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } }
      ];
    }
    const result = await userService.getAllUsers(mongoFilter, {
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

  async toggleActive(req: Request, res: Response) {
    const id = String(req.params.id);
    const user = await userService.toggleActive(id);
    res.json({
      success: true,
      message: `User ${user?.isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  }

  async updateMe(req: Request, res: Response) {
    const id = String(req.user?.userId);
    const data = updateProfileSchema.parse(req.body);
    const user = await userService.updateUser(id, data);
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }

  async updateProfile(req: Request, res: Response) {
    const id = String(req.user?.userId);
    const file = req.file as Express.Multer.File | undefined;

    let data: any = {};
    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch {
        data = req.body;
      }
    } else {
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
