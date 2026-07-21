import { Router } from "express";
import authController from "../../controllers/auth.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router = Router();
/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản người dùng mới
 *     description: >
 *       Tạo người dùng mới với nhà cung cấp local (email/mật khẩu).
 *       Khi thành công, tự động đặt `accessToken` (15 phút) và `refreshToken` (7 ngày) dưới dạng httpOnly cookies
 *       và trả về đối tượng người dùng đã tạo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *           example:
 *             firstName: John
 *             lastName: Doe
 *             email: john@example.com
 *             password: password123
 *             confirmPassword: password123
 *     responses:
 *       201:
 *         description: Tài khoản đã được tạo. Token được đặt dưới dạng httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJ...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng ký thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Register successfully
 *               data:
 *                 user:
 *                   _id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   gender: "other"
 *                   role: "user"
 *                   phone: null
 *                   provider: "local"
 *                   googleId: null
 *                   avatar: null
 *                   isEmailVerified: false
 *                   isActive: true
 *                   createdAt: "2026-07-21T10:00:00.000Z"
 *                   updatedAt: "2026-07-21T10:00:00.000Z"
 *       400:
 *         description: Lỗi validation (thiếu trường, mật khẩu không khớp, v.v.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "[\"First name is required\",\"Passwords do not match\"]"
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email already exists
 */
router.post("/register", asyncHandler(authController.register.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập bằng email và mật khẩu
 *     description: >
 *       Xác thực người dùng bằng email và mật khẩu.
 *       Yêu cầu email phải được xác thực trước.
 *       Khi thành công, tự động đặt `accessToken` (15 phút) và `refreshToken` (7 ngày) dưới dạng httpOnly cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công. Token được đặt dưới dạng httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIs...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Login successfully
 *               data:
 *                 user:
 *                   _id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   gender: "other"
 *                   role: "user"
 *                   phone: null
 *                   provider: "local"
 *                   googleId: null
 *                   avatar: null
 *                   isEmailVerified: true
 *                   isActive: true
 *                   createdAt: "2026-07-21T10:00:00.000Z"
 *                   updatedAt: "2026-07-21T10:00:00.000Z"
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid email or password
 *       403:
 *         description: Tài khoản bị khóa hoặc email chưa được xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notVerified:
 *                 summary: Email chưa được xác thực
 *                 value:
 *                   success: false
 *                   message: "Email not verified. Please verify your email before logging in."
 *               locked:
 *                 summary: Tài khoản bị khóa
 *                 value:
 *                   success: false
 *                   message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
 *               googleAccount:
 *                 summary: Tài khoản Google
 *                 value:
 *                   success: false
 *                   message: "Tài khoản này sử dụng đăng nhập Google. Vui lòng đăng nhập bằng Google."
 */
router.post("/login", asyncHandler(authController.login.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập hoặc đăng ký bằng Google OAuth
 *     description: >
 *       Xác thực bằng thông tin Google OAuth.
 *       - Nếu `googleId` tồn tại → đăng nhập.
 *       - Nếu email tồn tại nhưng không có `googleId` → liên kết tài khoản Google với tài khoản hiện có.
 *       - Nếu không tồn tại → tạo tài khoản mới với `provider: "google"` và `isEmailVerified: true`.
 *       Khi thành công, tự động đặt `accessToken` (15 phút) và `refreshToken` (7 ngày) dưới dạng httpOnly cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginInput'
 *           example:
 *             googleId: "1234567890"
 *             email: "john@gmail.com"
 *             name: "John Doe"
 *             avatar: "https://lh3.googleusercontent.com/..."
 *     responses:
 *       200:
 *         description: Đăng nhập Google thành công. Token được đặt dưới dạng httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIs...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng nhập Google thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Đăng nhập Google thành công
 *               data:
 *                 user:
 *                   _id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   email: "john@gmail.com"
 *                   gender: "other"
 *                   role: "user"
 *                   phone: null
 *                   provider: "google"
 *                   googleId: "1234567890"
 *                   avatar: "https://lh3.googleusercontent.com/..."
 *                   isEmailVerified: true
 *                   isActive: true
 *                   createdAt: "2026-07-21T10:00:00.000Z"
 *                   updatedAt: "2026-07-21T10:00:00.000Z"
 *       403:
 *         description: Tài khoản bị khóa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
 */
router.post("/google", asyncHandler(authController.googleLogin.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Làm mới access token
 *     description: >
 *       Sử dụng cookie `refreshToken` httpOnly để tạo cặp token mới.
 *       Refresh token cũ được xác minh bằng `JWT_REFRESH_SECRET`.
 *       Khi thành công, `accessToken` (15 phút) và `refreshToken` (7 ngày) mới được đặt dưới dạng httpOnly cookies.
 *     responses:
 *       200:
 *         description: Token đã được làm mới thành công. Token mới được đặt dưới dạng httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIs...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token đã được làm mới thành công
 *       401:
 *         description: Không có cookie refresh token hoặc token không hợp lệ/hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noToken:
 *                 summary: Thiếu cookie
 *                 value:
 *                   success: false
 *                   message: No refresh token provided
 *               invalidToken:
 *                 summary: Không hợp lệ hoặc đã hết hạn
 *                 value:
 *                   success: false
 *                   message: Invalid or expired refresh token
 */
router.post("/refresh", asyncHandler(authController.refreshToken.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng xuất người dùng hiện tại
 *     description: >
 *       Xóa cookie `accessToken` và `refreshToken` httpOnly.
 *       Không yêu cầu xác thực — có thể gọi ngay cả khi chưa đăng nhập.
 *     responses:
 *       200:
 *         description: Cookie đã được xóa thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đã đăng xuất thành công
 */
router.post("/logout", asyncHandler(authController.logout.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Lấy thông tin hồ sơ người dùng hiện tại
 *     description: >
 *       Trả về hồ sơ của người dùng đã xác thực.
 *       Yêu cầu JWT hợp lệ qua header `Authorization: Bearer <token>` hoặc cookie `accessToken`.
 *       Nếu tài khoản bị khóa (isActive = false), trả về 403.
 *       Phản hồi bao gồm trường `hasPassword` cho biết người dùng đã đặt mật khẩu hay chưa
 *       (hữu ích cho người dùng xác thực qua Google không thể đổi mật khẩu).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Hồ sơ người dùng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         hasPassword:
 *                           type: boolean
 *                           example: true
 *             example:
 *               success: true
 *               data:
 *                 _id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 gender: "other"
 *                 role: "user"
 *                 phone: null
 *                 provider: "local"
 *                 googleId: null
 *                 avatar: null
 *                 isEmailVerified: true
 *                 isActive: true
 *                 createdAt: "2026-07-21T10:00:00.000Z"
 *                 updatedAt: "2026-07-21T10:00:00.000Z"
 *                 hasPassword: true
 *       401:
 *         description: Thiếu hoặc không có token truy cập hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       403:
 *         description: Tài khoản bị khóa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
 */
router.get("/me", auth, asyncHandler(authController.getMe.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/send-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi mã xác thực email 6 chữ số
 *     description: >
 *       Gửi mã OTP 6 chữ số đến email của người dùng đã xác thực để xác minh email.
 *       Mã có hiệu lực trong 15 phút.
 *       Giới hạn tối đa 5 lần gửi lại mỗi ngày cho mỗi người dùng.
 *       Yêu cầu xác thực.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Mã xác thực đã được gửi đến email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Mã xác thực đã được gửi thành công
 *       400:
 *         description: Email đã được xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email is already verified
 *       429:
 *         description: Quá nhiều yêu cầu (tối đa 5 lần/ngày)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests. Please try again tomorrow
 */
router.post("/send-verification", auth, asyncHandler(authController.sendVerificationCode.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Xác thực email bằng mã 6 chữ số
 *     description: >
 *       Xác thực email của người dùng bằng mã 6 chữ số được gửi đến email.
 *       Mã có hiệu lực trong 15 phút.
 *       Yêu cầu xác thực.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailInput'
 *           example:
 *             code: "123456"
 *     responses:
 *       200:
 *         description: Email đã được xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Xác thực email thành công
 *       400:
 *         description: Mã không hợp lệ/hết hạn hoặc đã được xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidCode:
 *                 summary: Mã không hợp lệ hoặc đã hết hạn
 *                 value:
 *                   success: false
 *                   message: Invalid or expired verification code
 *               alreadyVerified:
 *                 summary: Đã xác thực
 *                 value:
 *                   success: false
 *                   message: Email is already verified
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/verify-email", auth, asyncHandler(authController.verifyEmail.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/resend-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi lại mã xác thực email
 *     description: >
 *       Gửi lại mã xác thực 6 chữ số mới đến email của người dùng.
 *       Xóa các mã cũ chưa sử dụng trước đó.
 *       Giới hạn tối đa 5 lần gửi lại mỗi ngày cho mỗi người dùng.
 *       Yêu cầu xác thực.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Mã xác thực mới đã được gửi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code resent successfully
 *       400:
 *         description: Email đã được xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email is already verified
 *       429:
 *         description: Quá nhiều yêu cầu (tối đa 5 lần/ngày)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests. Please try again tomorrow
 */
router.post("/resend-verification", auth, asyncHandler(authController.resendVerificationCode.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Yêu cầu email đặt lại mật khẩu
 *     description: >
 *       Gửi liên kết đặt lại mật khẩu đến địa chỉ email đã cho.
 *       Liên kết chứa token UUID có hiệu lực trong 15 phút.
 *       **Im lặng**: Nếu email không tồn tại, vẫn trả về 200 để tránh dò tìm email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *           example:
 *             email: john@example.com
 *     responses:
 *       200:
 *         description: Liên kết đặt lại mật khẩu đã được gửi (nếu email tồn tại). Luôn trả về 200 để tránh dò tìm email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi
 */
router.post("/forgot-password", asyncHandler(authController.forgotPassword.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Đặt lại mật khẩu bằng token
 *     description: >
 *       Đặt lại mật khẩu bằng token nhận được qua email.
 *       Token là UUID v4 có hiệu lực trong 15 phút.
 *       Sau khi sử dụng, token được đánh dấu đã dùng và không thể sử dụng lại.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *           example:
 *             token: "550e8400-e29b-41d4-a716-446655440000"
 *             password: "newPassword123"
 *             confirmPassword: "newPassword123"
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid/expired token or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidToken:
 *                 summary: Token không hợp lệ hoặc đã hết hạn
 *                 value:
 *                   success: false
 *                   message: Invalid or expired reset token
 *               passwordMismatch:
 *                 summary: Mật khẩu không khớp
 *                 value:
 *                   success: false
 *                   message: "[\"Passwords do not match\"]"
 */
router.post("/reset-password", asyncHandler(authController.resetPassword.bind(authController)));
/**
 * @openapi
 * /api/v1/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Đổi mật khẩu (đã xác thực)
 *     description: >
 *       Thay đổi mật khẩu cho người dùng hiện tại đã xác thực.
 *       Yêu cầu mật khẩu hiện tại để xác minh.
 *       Chỉ hoạt động với tài khoản có `provider: "local"`.
 *       Tài khoản xác thực qua Google không thể đổi mật khẩu.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *           example:
 *             currentPassword: "oldPassword123"
 *             newPassword: "newPassword123"
 *             confirmPassword: "newPassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thành công
 *       400:
 *         description: Wrong current password or Google account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               wrongPassword:
 *                 summary: Mật khẩu hiện tại không đúng
 *                 value:
 *                   success: false
 *                   message: "Mật khẩu hiện tại không đúng"
 *               googleAccount:
 *                 summary: Không thể đổi mật khẩu tài khoản Google
 *                 value:
 *                   success: false
 *                   message: "Tài khoản này sử dụng đăng nhập Google. Không thể thay đổi mật khẩu."
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/change-password", auth, asyncHandler(authController.changePassword.bind(authController)));
export default router;
