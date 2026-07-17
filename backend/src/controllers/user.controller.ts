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

  async updateProfile(req: Request, res: Response) {
    const id = String(req.user?.userId);
    const file = req.file as Express.Multer.File | undefined;

    // Parse body data - handle both JSON and form-data
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

    // Update text fields if provided
    let user;
    if (Object.keys(data).length > 0) {
      user = await userService.updateUser(id, data);
    }

    // Upload avatar if file provided
    if (file) {
      user = await userService.uploadAvatar(id, file);
    }

    // Fetch latest user data
    if (!user) {
      user = await userService.getUserById(id);
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }

  async addAddress(req: Request, res: Response) {
    const userId = String(req.user?.userId);
    const addressData = req.body;

    const requiredFields = [
      "receiverName", "receiverPhone", 
      "provinceCode", "provinceName", 
      "districtCode", "districtName", 
      "wardCode", "wardName", 
      "streetAddress"
    ];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        res.status(400).json({
          success: false,
          message: `${field} is required`
        });
        return;
      }
    }

    const user = await userService.addAddress(userId, addressData);
    res.json({
      success: true,
      message: "Address added successfully",
      data: user.addresses,
    });
  }

  async updateAddress(req: Request, res: Response) {
    const userId = String(req.user?.userId);
    const addressId = String(req.params.addressId);
    const addressData = req.body;

    const user = await userService.updateAddress(userId, addressId, addressData);
    res.json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses,
    });
  }

  async deleteAddress(req: Request, res: Response) {
    const userId = String(req.user?.userId);
    const addressId = String(req.params.addressId);

    const user = await userService.deleteAddress(userId, addressId);
    res.json({
      success: true,
      message: "Address deleted successfully",
      data: user.addresses,
    });
  }

  async setDefaultAddress(req: Request, res: Response) {
    const userId = String(req.user?.userId);
    const addressId = String(req.params.addressId);

    const user = await userService.setDefaultAddress(userId, addressId);
    res.json({
      success: true,
      message: "Default address set successfully",
      data: user.addresses,
    });
  }
}

export default new UserController();
