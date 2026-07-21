import { Router } from "express";
import userController from "../../controllers/user.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { uploadAvatar } from "../../middlewares/upload.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Lấy danh sách tất cả người dùng (Admin)
 *     description: >
 *       Trả về danh sách người dùng phân trang.
 *       Hỗ trợ lọc theo trạng thái, tìm kiếm theo tên/email, sắp xếp.
 *       Yêu cầu quyền Admin.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "-createdAt" }
 *         description: Sắp xếp (vd: "createdAt", "-createdAt")
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Tìm kiếm theo tên hoặc email
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [user, admin] }
 *         description: Lọc theo vai trò
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *         description: Lọc theo trạng thái hoạt động
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsers'
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Không đủ quyền (cần Admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", checkRole(ROLES.ADMIN), asyncHandler(userController.getAll.bind(userController)));

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Lấy thông tin người dùng theo ID
 *     description: >
 *       Trả về thông tin chi tiết của một người dùng.
 *       Yêu cầu xác thực.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", asyncHandler(userController.getById.bind(userController)));

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Cập nhật thông tin người dùng (Admin)
 *     description: >
 *       Cập nhật thông tin của một người dùng theo ID.
 *       Yêu cầu quyền Admin.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: User updated successfully }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền (cần Admin)
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.patch("/:id", checkRole(ROLES.ADMIN), asyncHandler(userController.update.bind(userController)));

/**
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Cập nhật thông tin cá nhân
 *     description: >
 *       Cập nhật thông tin của người dùng hiện tại (name, email, phone, gender).
 *       Không thể thay đổi role qua endpoint này.
 *       Yêu cầu xác thực.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateInput'
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Profile updated successfully }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 */
router.patch("/me", auth, asyncHandler(userController.updateMe.bind(userController)));

/**
 * @openapi
 * /api/v1/users/profile:
 *   patch:
 *     tags: [Users]
 *     summary: Cập nhật hồ sơ cá nhân (kèm ảnh đại diện)
 *     description: >
 *       Cập nhật thông tin hồ sơ của người dùng hiện tại.
 *       Có thể upload ảnh đại diện (multipart/form-data).
 *       Yêu cầu xác thực.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ProfileUpdateInput'
 *               - type: object
 *                 properties:
 *                   avatar:
 *                     type: string
 *                     format: binary
 *                     description: File ảnh đại diện
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Profile updated successfully }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 */
router.patch("/profile", auth, ...uploadAvatar, asyncHandler(userController.updateProfile.bind(userController)));

/**
 * @openapi
 * /api/v1/users/{id}/toggle-active:
 *   patch:
 *     tags: [Users]
 *     summary: Bật/tắt trạng thái hoạt động của người dùng (Admin)
 *     description: >
 *       Kích hoạt hoặc vô hiệu hóa tài khoản người dùng.
 *       Không thể vô hiệu hóa tài khoản quản trị viên.
 *       Yêu cầu quyền Admin.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: User activated successfully }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền hoặc không thể vô hiệu hóa tài khoản admin
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.patch("/:id/toggle-active", checkRole(ROLES.ADMIN), asyncHandler(userController.toggleActive.bind(userController)));

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Xóa người dùng (Admin)
 *     description: >
 *       Xóa vĩnh viễn một người dùng khỏi hệ thống,
 *       bao gồm cả ảnh đại diện trên Cloudinary.
 *       Yêu cầu quyền Admin.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: User deleted successfully }
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền (cần Admin)
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.delete("/:id", checkRole(ROLES.ADMIN), asyncHandler(userController.delete.bind(userController)));

export default router;
